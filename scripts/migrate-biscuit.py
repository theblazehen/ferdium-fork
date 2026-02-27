#!/usr/bin/env python3
"""
Biscuit → FerdiumDev migration script.

Imports all tabs (services), tab groups (workspaces), and session data
(cookies, localStorage, IndexedDB) from Biscuit into FerdiumDev.

Usage:
    python3 scripts/migrate-biscuit.py                # dry-run (default)
    python3 scripts/migrate-biscuit.py --execute       # real migration
    python3 scripts/migrate-biscuit.py --execute --clean  # wipe existing + migrate
"""

import json
import sqlite3
import shutil
import uuid
import os
import sys
import argparse
from pathlib import Path
from datetime import datetime

# ── Paths ──────────────────────────────────────────────────────────────
BISCUIT_CONFIG = Path.home() / ".config/biscuit"
FERDIUM_CONFIG = Path.home() / ".config/FerdiumDev"
FERDIUM_SRC = Path(__file__).resolve().parent.parent  # repo root
BISCUIT_BACKUP = BISCUIT_CONFIG / "backups/2025-12-20_20.json"

# ── Biscuit appId → Ferdium recipeId ──────────────────────────────────
RECIPE_MAP = {
    "slack": "slack",
    "gmail": "gmail",
    "whats-app": "whatsapp",
    "youtube": "youtubemusic",
    "discord": "discord",
    "toggl": "toggl",
    "generic": "franz-custom-website",
}

# ── Only copy session-critical data (skip caches) ────────────────────
ESSENTIAL_ITEMS = [
    "Cookies",
    "Cookies-journal",
    "Local Storage",
    "IndexedDB",
    "Preferences",
    "Network Persistent State",
    "TransportSecurity",
]

# ── Default Ferdium service settings ─────────────────────────────────
DEFAULT_SETTINGS = {
    "isEnabled": True,
    "isHibernationEnabled": False,
    "isWakeUpEnabled": True,
    "isNotificationEnabled": True,
    "isBadgeEnabled": True,
    "isMediaBadgeEnabled": False,
    "trapLinkClicks": False,
    "useFavicon": False,
    "isMuted": False,
    "customIcon": None,
    "isDarkModeEnabled": False,
    "isProgressbarEnabled": False,
    "spellcheckerLanguage": None,
    "userAgentPref": None,
    "isIndirectMessageBadgeEnabled": False,
    "proxy": {
        "isEnabled": False,
        "host": "",
        "port": 0,
        "user": "",
        "password": "",
    },
    "darkReaderSettings": {
        "brightness": 100,
        "contrast": 90,
        "sepia": 10,
    },
}


def log(msg, indent=0):
    prefix = "  " * indent
    print(f"{prefix}{msg}")


def preflight_checks():
    """Ensure apps are stopped and paths exist."""
    lock = FERDIUM_CONFIG / "SingletonLock"
    if lock.exists():
        sys.exit(
            "ERROR: FerdiumDev appears to be running (SingletonLock exists). Stop it first."
        )

    biscuit_lock = BISCUIT_CONFIG / "SingletonLock"
    if biscuit_lock.exists():
        log(
            "WARNING: Biscuit may be running (SingletonLock exists). Cookies may be inconsistent."
        )

    if not BISCUIT_BACKUP.exists():
        sys.exit(f"ERROR: Biscuit backup not found: {BISCUIT_BACKUP}")

    if not (FERDIUM_CONFIG / "server.sqlite").exists():
        sys.exit(
            f"ERROR: FerdiumDev database not found: {FERDIUM_CONFIG / 'server.sqlite'}"
        )


def flush_wal(db_path: Path):
    """Flush WAL journal to main DB file if it exists."""
    if db_path.exists():
        try:
            conn = sqlite3.connect(str(db_path))
            conn.execute("PRAGMA wal_checkpoint(FULL);")
            conn.close()
        except Exception as e:
            log(f"  WARNING: Could not flush WAL on {db_path}: {e}")


def get_partition_dir(tab, group):
    """Determine Biscuit partition directory based on shared/non-shared semantics."""
    if group.get("shared"):
        return BISCUIT_CONFIG / "Partitions" / group["id"]
    return BISCUIT_CONFIG / "Partitions" / tab["id"]


def build_settings(tab, recipe_id):
    """Build Ferdium service settings JSON from Biscuit tab data."""
    settings = {**DEFAULT_SETTINGS, "recipeId": recipe_id, "name": tab["name"]}

    biscuit_settings = tab.get("settings", {})

    # Slack: map subdomain → teamId (used by recipe's serviceURL template)
    if recipe_id == "slack" and "subdomain" in biscuit_settings:
        settings["team"] = biscuit_settings["subdomain"]

    # Custom website: set customUrl
    if recipe_id == "franz-custom-website":
        settings["customUrl"] = biscuit_settings.get(
            "entryPointUrl", tab.get("url", "")
        )
        settings["hasCustomUrl"] = True

    return settings


def copy_partition(src: Path, dst: Path, dry_run=False):
    """Copy only essential session data from a Biscuit partition to Ferdium."""
    if not src.exists():
        log(f"  WARNING: Source partition missing: {src}", indent=2)
        return 0

    total_size = 0
    if not dry_run:
        dst.mkdir(parents=True, exist_ok=True)

    for item_name in ESSENTIAL_ITEMS:
        src_item = src / item_name
        dst_item = dst / item_name

        if not src_item.exists():
            continue

        if src_item.is_dir():
            size = sum(f.stat().st_size for f in src_item.rglob("*") if f.is_file())
            total_size += size
            if not dry_run:
                if dst_item.exists():
                    shutil.rmtree(str(dst_item))
                shutil.copytree(str(src_item), str(dst_item))
            log(f"  {item_name}/ ({size // 1024}KB)", indent=2)
        else:
            size = src_item.stat().st_size
            total_size += size
            if not dry_run:
                shutil.copy2(str(src_item), str(dst_item))
            log(f"  {item_name} ({size // 1024}KB)", indent=2)

    return total_size


def install_recipes(needed_recipes, dry_run=False):
    """Install needed recipes from source tree to FerdiumDev config."""
    recipes_src = FERDIUM_SRC / "recipes" / "recipes"
    recipes_dst = FERDIUM_CONFIG / "recipes"

    if not recipes_dst.exists() and not dry_run:
        recipes_dst.mkdir(parents=True, exist_ok=True)

    for recipe_id in needed_recipes:
        src = recipes_src / recipe_id
        dst = recipes_dst / recipe_id

        if dst.exists():
            log(f"  Recipe '{recipe_id}' already installed", indent=1)
            continue

        if not src.exists():
            log(
                f"  WARNING: Recipe '{recipe_id}' not found in source tree: {src}",
                indent=1,
            )
            continue

        if not dry_run:
            shutil.copytree(str(src), str(dst))
        log(f"  Recipe '{recipe_id}' → installed", indent=1)


def clean_existing(conn, dry_run=False):
    """Remove existing services, workspaces, and their partitions."""
    if not dry_run:
        # Get existing service IDs to remove their partitions
        cursor = conn.execute("SELECT serviceId FROM services")
        for row in cursor.fetchall():
            part_dir = FERDIUM_CONFIG / "Partitions" / f"service-{row[0]}"
            if part_dir.exists():
                shutil.rmtree(str(part_dir))
                log(f"  Removed partition: service-{row[0]}", indent=1)

        conn.execute("DELETE FROM services")
        conn.execute("DELETE FROM workspaces")
        # Reset autoincrement
        conn.execute(
            "DELETE FROM sqlite_sequence WHERE name IN ('services', 'workspaces')"
        )
        conn.commit()

    log("  Cleaned existing services and workspaces")


def main():
    parser = argparse.ArgumentParser(description="Migrate Biscuit data to FerdiumDev")
    parser.add_argument(
        "--execute",
        action="store_true",
        help="Actually perform the migration (default is dry-run)",
    )
    parser.add_argument(
        "--clean",
        action="store_true",
        help="Remove existing FerdiumDev services before migrating",
    )
    args = parser.parse_args()

    dry_run = not args.execute
    if dry_run:
        log("╔══════════════════════════════════════╗")
        log("║         DRY RUN — no changes         ║")
        log("║   Add --execute to really migrate     ║")
        log("╚══════════════════════════════════════╝")
        log("")

    # ── Preflight ─────────────────────────────────────────────────────
    log("▸ Preflight checks...")
    preflight_checks()
    log("  ✓ All checks passed")

    # ── Load Biscuit state ────────────────────────────────────────────
    log("\n▸ Loading Biscuit backup...")
    backup = json.loads(BISCUIT_BACKUP.read_text())
    groups = backup["groupList"]["tabGroups"]
    total_tabs = sum(len(g.get("tabs", [])) for g in groups)
    log(f"  Found {len(groups)} groups, {total_tabs} tabs")

    # ── Print migration plan ──────────────────────────────────────────
    log("\n▸ Migration plan:")
    needed_recipes = set()
    for group in groups:
        group_name = group["name"].strip() or "Archive"
        shared = "SHARED" if group.get("shared") else ""
        opened = "collapsed" if not group.get("opened", True) else ""
        log(f"\n  Workspace: {group_name} {shared} {opened}")
        for tab in group.get("tabs", []):
            recipe_id = RECIPE_MAP.get(tab.get("appId", ""), "franz-custom-website")
            needed_recipes.add(recipe_id)
            partition_src = get_partition_dir(tab, group)
            exists = "✓" if partition_src.exists() else "✗ MISSING"
            log(
                f"    {tab['name']:25s} → recipe:{recipe_id:25s} partition:{partition_src.name} [{exists}]"
            )

    # ── Backup DB ─────────────────────────────────────────────────────
    log("\n▸ Backing up database...")
    db_path = FERDIUM_CONFIG / "server.sqlite"
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = db_path.parent / f"server.sqlite.bak.{ts}"
    if not dry_run:
        shutil.copy2(str(db_path), str(backup_path))
    log(f"  → {backup_path.name}")

    # ── Install recipes ───────────────────────────────────────────────
    log("\n▸ Installing recipes...")
    install_recipes(needed_recipes, dry_run=dry_run)

    # ── Open DB ───────────────────────────────────────────────────────
    conn = sqlite3.connect(str(db_path))

    # ── Clean existing (if requested) ─────────────────────────────────
    if args.clean:
        log("\n▸ Cleaning existing data...")
        clean_existing(conn, dry_run=dry_run)

    # ── Migrate ───────────────────────────────────────────────────────
    log("\n▸ Creating services and copying partitions...")
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    workspace_order = 0
    total_size = 0
    service_count = 0

    for group in groups:
        group_name = group["name"].strip() or "Archive"
        workspace_id = str(uuid.uuid4())
        workspace_order += 1
        service_ids = []

        log(f"\n  ┌─ Workspace: {group_name}")

        for tab in group.get("tabs", []):
            service_id = str(uuid.uuid4())
            recipe_id = RECIPE_MAP.get(tab.get("appId", ""), "franz-custom-website")
            settings = build_settings(tab, recipe_id)

            log(f"  │  Service: {tab['name']} ({recipe_id}) → {service_id[:8]}...")

            # Flush source cookies WAL before copy
            src_partition = get_partition_dir(tab, group)
            flush_wal(src_partition / "Cookies")

            # Copy partition data
            dst_partition = FERDIUM_CONFIG / "Partitions" / f"service-{service_id}"
            size = copy_partition(src_partition, dst_partition, dry_run=dry_run)
            total_size += size

            # Insert service row
            if not dry_run:
                conn.execute(
                    "INSERT INTO services (serviceId, name, recipeId, settings, created_at, updated_at) "
                    "VALUES (?, ?, ?, ?, ?, ?)",
                    (
                        service_id,
                        tab["name"],
                        recipe_id,
                        json.dumps(settings),
                        now,
                        now,
                    ),
                )

            service_ids.append(service_id)
            service_count += 1

        # Insert workspace row
        if not dry_run:
            conn.execute(
                "INSERT INTO workspaces (workspaceId, name, [order], services, data, created_at, updated_at) "
                "VALUES (?, ?, ?, ?, ?, ?, ?)",
                (
                    workspace_id,
                    group_name,
                    workspace_order,
                    json.dumps(service_ids),
                    "{}",
                    now,
                    now,
                ),
            )

        log(f"  └─ {len(service_ids)} services → workspace {workspace_id[:8]}...")

    # ── Commit ────────────────────────────────────────────────────────
    if not dry_run:
        conn.commit()
    conn.close()

    # ── Summary ───────────────────────────────────────────────────────
    log(f"\n{'═' * 50}")
    log(f"  Services created:  {service_count}")
    log(f"  Workspaces created: {workspace_order}")
    log(f"  Data copied:       {total_size // (1024 * 1024)}MB")
    if dry_run:
        log(f"\n  DRY RUN — add --execute to perform migration")
        log(f"  Recommended: python3 {__file__} --execute --clean")
    else:
        log(f"\n  ✓ Migration complete!")
        log(f"  Start FerdiumDev to verify: mise run dev")
    log(f"{'═' * 50}")


if __name__ == "__main__":
    main()
