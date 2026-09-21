<p align="center">
    <a href="https://ferdium.org">
      <img src="./build-helpers/images/icon.png" alt="" width="250"/>
    </a>
</p>
<p align="center">
    <a href="https://ferdium.org/download">
      <img src="./branding/download.png" alt="Download" width="150"/>
    </a>
</p>

# Ferdium Fork

Personal fork of [Ferdium](https://github.com/ferdium/ferdium-app) with Biscuit-style customizations. WM_CLASS stays `ferdium`/`Ferdium` for herbstluftwm/tdrop compatibility.

## Fork Changes

- **Ctrl+W disabled** — removed app-level Ctrl+W handler so it passes through to webviews
- **Cookie encryption bypass** — `password-store=basic` for plain-text cookies, easy import/export between machines
- **Auto-updater disabled** — fork binaries don't match upstream, updater fully disabled
- **Zero border-radius** — global `* { border-radius: 0 !important }` injected into all webviews and applied via SCSS/theme overrides
- **Workspace-grouped sidebar** — services shown grouped by workspace with collapsible headers, per-group drag-and-drop reordering, dense layout (28px tab height, 18px icons, 12px labels), left-bar active indicator, and a drag-to-resize handle (150-400px, persisted to localStorage)
- **CDP debugging** — `FERDIUM_CDP=1` env var enables Chrome DevTools Protocol on port 9222
- **Dev crash guards** — ENOENT guards for missing `sandboxes.json`, `build/recipes/all.json`, and `Partitions/` directory
- **Biscuit migration** — `scripts/migrate-biscuit.py` imports tabs, groups, cookies, localStorage, and IndexedDB from Biscuit
- **In-app popup windows** — all webview popups (OAuth, target="_blank", window.open) open as child BrowserWindows instead of system browser
- **Global Firefox UA cloaking** — Firefox 148 UA string globally, suppresses sec-ch-ua Client Hints, bypasses Google's embedded-browser detection
- **Google sandbox session sharing** — Google services (YouTube, Gmail, Toggl) share a sandbox partition so auth cookies propagate; sign in via YouTube, Gmail picks up the session
- **Build optimization** — Linux targets reduced to `dir` x64 only for fast personal builds
[![Open Collective backers](https://img.shields.io/static/v1?label=Contribute%20on%20Open%20Collective&message=Donate%20to%20Ferdium&color=9cf&logo=open-collective)](https://opencollective.com/ferdium#category-CONTRIBUTE)
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
<a href='#contributors-'><img src='https://img.shields.io/badge/contributors-336-default.svg?logo=github&color=6c64e4' alt='Contributors'/></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->

## Setup

```bash
git clone --recurse-submodules https://github.com/theblazehen/ferdium-fork
cd ferdium-fork
mise install                          # node 22.18.0 + pnpm 10.14.0
pnpm install
pnpm --dir recipes install && pnpm --dir recipes package
node esbuild.mjs                      # initial build
mise run dev                          # start with CDP debugging
```

See [AGENTS.md](./AGENTS.md) for architecture notes and detailed file map.

---

<details>
<summary>Original Ferdium README</summary>

> Hard-fork of [Franz](https://github.com/meetfranz/franz), adding awesome features and removing unwanted ones.

Ferdium is a desktop app that helps you organize how you use your favourite apps by combining them into one application. It is based on Franz - a software already used by thousands of people - with the difference that Ferdium gives you many additional features and doesn't restrict its usage! Furthermore, Ferdium is compatible with your existing Franz account, so you can continue right where you left off. Please find out more about Ferdium and its features on [ferdium.org](https://ferdium.org).

</details>

## Screenshots

<details>
<summary>Toggle screenshots</summary>
<p align="center">
<img alt="Keep all your messaging services in one place." src="./branding/screenshots/hero.png">
<em>"Keep all your messaging services in one place."</em>
<img alt="Order your services with Ferdium Workspaces." src="./branding/screenshots/workspaces.png">
<em>"Order your services with Ferdium Workspaces."</em>
<img alt="Always keep your Todos list open with Ferdium Todos." src="./branding/screenshots/todos.png">
<em>"Always keep your Todos list open with Ferdium Todos."</em>
<img alt="Supporting all your services." src="./branding/screenshots/service-store.png">
<em>"Supporting all your services."</em>
</p>
</details>

## Download

👉 [ferdium.org/download](https://ferdium.org/download)

Assets made available via [GitHub releases](https://github.com/ferdium/ferdium-app/releases/latest).

_Find answers to frequently asked questions on [ferdium.org/faq](https://ferdium.org/faq)._

## Migrating from Ferdi

If you are a pre-existing user of Ferdi, and are thinking of switching to Ferdium, you might want to run [the following scripts](./scripts/migration) to migrate your existing Ferdi profile such that Ferdium can pick up the configurations. (.ps1 for PowerShell/Windows users and .sh for UNIX (Linux and MacOS users). For a more detailed explanation, please see [MIGRATION.md](docs/MIGRATION.md)

## Styling

You can style Ferdium's UI with the `USER_DATA/Ferdium/config/custom.css` file.

> **Note**
>
> `USER_DATA`'s location depends on your platform:
>
> - **Windows**: `%APPDATA%`
> - **Linux**: `$XDG_CONFIG_HOME` or `~/.config/`
> - **MacOS**: `~/Library/Application Support`

## Contributing

Please read the [contributing guidelines](CONTRIBUTING.md) to setup your development machine and proceed.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href='https://vantezzen.io' title='Bennett: code, design, doc, ideas, translation, example, bug, content, infra, userTesting, question, projectManagement, review, translation, userTesting'><img src='https://avatars2.githubusercontent.com/u/10333196?v=4' alt='vantezzen' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/vraravam' title='Vijay Raghavan Aravamudhan: blog, bug, code, content, design, doc, ideas, infra, maintenance, mentoring, platform, projectManagement, question, review, translation, userTesting'><img src='https://avatars.githubusercontent.com/u/69629?v=4' alt='vraravam' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='http://www.adlk.io' title='Stefan Malzner: code, content, design, doc, ideas, infra, projectManagement, test, translation'><img src='https://avatars1.githubusercontent.com/u/3265004?v=4' alt='adlk' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/Makazzz' title='Makazzz: bug, code, translation, content, doc, platform, translation'><img src='https://avatars2.githubusercontent.com/u/49844464?v=4' alt='Makazzz' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='http://seriesgt.com' title='ZeroCool: code, ideas'><img src='https://avatars3.githubusercontent.com/u/5977640?v=4' alt='ZeroCool940711' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/rseitbekov' title='rseitbekov: code'><img src='https://avatars2.githubusercontent.com/u/35684439?v=4' alt='rseitbekov' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://djangogigs.com/developers/peter-bittner/' title='Peter Bittner: ideas, bug'><img src='https://avatars2.githubusercontent.com/u/665072?v=4' alt='bittner' style='width:100px;'/></a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/justus-saul' title='Justus Saul: bug, ideas'><img src='https://avatars1.githubusercontent.com/u/5861826?v=4' alt='justus-saul' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/igreil' title='igreil: ideas'><img src='https://avatars0.githubusercontent.com/u/17239151?v=4' alt='igreil' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='http://marcolopes.eu' title='Marco Lopes: ideas'><img src='https://avatars1.githubusercontent.com/u/431889?v=4' alt='marcolopes' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/dayzlun' title='dayzlun: bug'><img src='https://avatars3.githubusercontent.com/u/17259690?v=4' alt='dayzlun' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://twitter.com/tobigue_' title='Tobias Günther: ideas'><img src='https://avatars2.githubusercontent.com/u/1560152?v=4' alt='tobigue' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/AGCaesar' title='AGCaesar: platform'><img src='https://avatars3.githubusercontent.com/u/7844066?v=4' alt='AGCaesar' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/xthursdayx' title='xthursdayx: code, doc, infra, platform'><img src='https://avatars0.githubusercontent.com/u/18044308?v=4' alt='xthursdayx' style='width:100px;'/></a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/Gaboris' title='Gaboris: question, bug'><img src='https://avatars2.githubusercontent.com/u/9462372?v=4' alt='Gaboris' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='http://www.cu3ed.com/' title='Ce: bug'><img src='https://avatars1.githubusercontent.com/u/61343?v=4' alt='incace' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='http://pztrn.name/' title='Stanislav N.: bug'><img src='https://avatars1.githubusercontent.com/u/869402?v=4' alt='pztrn' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='http://www.patrickcurl.com' title='Patrick Curl: ideas'><img src='https://avatars1.githubusercontent.com/u/1470061?v=4' alt='patrickcurl' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/Stanzilla' title='Benjamin Staneck: design'><img src='https://avatars3.githubusercontent.com/u/75278?v=4' alt='Stanzilla' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/ammarmalhas' title='ammarmalhas: bug, security'><img src='https://avatars1.githubusercontent.com/u/57057209?v=4' alt='ammarmalhas' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/steliyan' title='Steliyan Stoyanov: code, ideas'><img src='https://avatars1.githubusercontent.com/u/1850292?v=4' alt='steliyan' style='width:100px;'/></a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/brorbw' title='Bror Winther: doc'><img src='https://avatars2.githubusercontent.com/u/5909562?v=4' alt='brorbw' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://fwdekker.com/' title='Felix W. Dekker: doc'><img src='https://avatars0.githubusercontent.com/u/13442533?v=4' alt='FWDekker' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/Sauceee' title='Sauceee: design'><img src='https://avatars2.githubusercontent.com/u/17987941?v=4' alt='Sauceee' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='http://lhw.ring0.de' title='Lennart Weller: platform'><img src='https://avatars2.githubusercontent.com/u/351875?v=4' alt='lhw' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/jereksel' title='Andrzej Ressel: code'><img src='https://avatars0.githubusercontent.com/u/1307829?v=4' alt='jereksel' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://gitlab.com/dpeukert' title='Daniel Peukert: code'><img src='https://avatars2.githubusercontent.com/u/3451904?v=4' alt='dpeukert' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/Ali_Shiple' title='Ali M. Shiple: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/12895436/small/00917d09ca1b4b6d8e0ef36af07ecf6b.jpg' alt='Ali_Shiple' style='width:100px;'/></a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/elviseras' title='elviseras: translation'><img src='https://www.gravatar.com/avatar/25c2cf0d8cb4a4141e71c3b8a2e9324f' alt='elviseras' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/J370' title='J370: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/14141203/small/7b12b5db419d8796450221c2eaaf6003.png' alt='J370' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/keunes' title='Koen: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/13018172/small/829115c606347b10218f34c637a2100c.png' alt='keunes' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/leandrogehlen' title='Leandro Gehlen: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/14099621/small/1d9503523839c310dbce0af3c226e894.jpeg' alt='leandrogehlen' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/Matthieu42' title='Matthieu42: translation'><img src='https://www.gravatar.com/avatar/735217ccccf11ba97573deee517ddb19' alt='Matthieu42' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/nicky18013' title='Nikita Bibanaev: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/13468928/small/2b31e7ac19645d950a79b33ffd5721b8.png' alt='nicky18013' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/Tatjana1998' title='Tatjana1998: translation'><img src='https://www.gravatar.com/avatar/ade202a04fcbb2c177e4f1d9936af29e' alt='Tatjana1998' style='width:100px;'/></a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/seayko' title='tinect: translation'><img src='https://www.gravatar.com/avatar/65e2aef738ddf828f822d8463fd04918' alt='seayko' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/Pusnow' title='Wonsup Yoon: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/13514833/small/65f0b45587cc7e34f2827830cd324b16.jpeg' alt='Pusnow' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/zutt' title='zutt: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/13320003/small/50fdf9f8c7e54a446925bd79696ea625.JPG' alt='zutt' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='http://twitter.com/noemis_exec' title='n0emis: code, translation'><img src='https://avatars3.githubusercontent.com/u/22817873?v=4' alt='n0emis' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://www.monke-agency.com/equipe.html' title='gmarec: code'><img src='https://avatars2.githubusercontent.com/u/3405028?v=4' alt='gmarec' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/127oo1' title='127oo1: translation'><img src='https://www.gravatar.com/avatar/060c722be11da16ae31902e9c98326b2' alt='127oo1' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/ChTBoner' title='ChTBoner: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/13273153/small/a810886febf5199cfa1c98644444dea7.jpeg' alt='ChTBoner' style='width:100px;'/></a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/johanengstrand' title='Johan Engstrand: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/14152801/small/fd395f120efca971ca9b34c57fd02cca.png' alt='johanengstrand' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://mrassili.com' title='Marouane R: code'><img src='https://avatars0.githubusercontent.com/u/25288435?v=4' alt='mrassili' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/yourcontact' title='Roman: code, ideas'><img src='https://avatars2.githubusercontent.com/u/46404814?v=4' alt='yourcontact' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/mahadevans87' title='Mahadevan Sreenivasan: code, ideas, review, bug, doc, userTesting'><img src='https://avatars1.githubusercontent.com/u/1255523?v=4' alt='mahadevans87' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://jakelee.co.uk' title='Jake Lee: content'><img src='https://avatars2.githubusercontent.com/u/12380876?v=4' alt='JakeSteam' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/sampathBlam' title='Sampath Kumar Krishnan: code, review, ideas, bug, doc, userTesting'><img src='https://avatars1.githubusercontent.com/u/17728976?v=4' alt='sampathBlam' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/saruwman' title='saruwman: doc, code'><img src='https://avatars2.githubusercontent.com/u/41330038?v=4' alt='saruwman' style='width:100px;'/></a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/dorukkarinca' title='dorukkarinca: bug'><img src='https://avatars0.githubusercontent.com/u/9303867?v=4' alt='dorukkarinca' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://www.linkedin.com/in/gautamsi' title='Gautam Singh: code'><img src='https://avatars2.githubusercontent.com/u/5769869?v=4' alt='gautamsi' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://feikojoosten.com' title='Feiko Joosten: code'><img src='https://avatars0.githubusercontent.com/u/10920052?v=4' alt='FeikoJoosten' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/2bdelghafour' title='2bdelghafour: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/14219410/small/31ff20f60d352fb46e314f3c180a77b0.jpeg' alt='2bdelghafour' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/abdoutanta' title='Abderrahim Tantaoui: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/14213908/small/5b2fc8166f8a0a2b7313fbf49ee5b6b6.jpeg' alt='abdoutanta' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/AndiLeni' title='AndiLeni: translation'><img src='https://www.gravatar.com/avatar/4bd0da860de38afa735425ce2d4e10b5' alt='AndiLeni' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/brunofalmada' title='Bruno Almada: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/14200540/small/f6f1addceeeabc02488f9b08520a902f.jpeg' alt='brunofalmada' style='width:100px;'/></a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/Catarino' title='Catarino Gonçalo: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/14208802/small/07287eb2de671257ca3d6bb4ba1cca67.jpeg' alt='Catarino' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/Alzemand' title='Edilson Alzemand Sigmaringa Junior: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/14184269/small/f5e68247f01988ae7951a282f0fd4d06.jpeg' alt='Alzemand' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/MAT-OUT' title='MAT-OUT: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/14201550/small/68dd2402bf2879bc3ca312d627710400.png' alt='MAT-OUT' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/mazzo98' title='mazzo98: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/12864917/small/69799b5fd7be2f67282715d5cdfd4ae1.png' alt='mazzo98' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/paprika-naught-tiffin-flyspeck' title='paprika-naught-tiffin-flyspeck: translation'><img src='https://www.gravatar.com/avatar/8671ebe7a7164dfa7624fbdbff69ed96' alt='paprika-naught-tiffin-flyspeck' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/patrickvalle' title='Patrick Valle: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/14217484/small/8b73f313ee79fe33625e819cdac86551.jpg' alt='patrickvalle' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/peq42' title='peq42_: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/14155811/small/b62a94dde7ec29948ec6a6af9fd24b1d.png' alt='peq42' style='width:100px;'/></a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/karlinhos' title='Pumbinha: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/14161139/small/96450eb44c22b3141ab4401e547109b8.png' alt='karlinhos' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/dies' title='Serhiy Dmytryshyn: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/1/small/e84bcdf6c084ffd52527931f988fb410.png' alt='dies' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/SMile61' title='SMile61: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/14177585/small/1bb4f6ba39bff3df8f579e61460ce016.png' alt='SMile61' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/tinect' title='tinect: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/12521988/small/56c2041645746af9e51dd28782b828c3.jpeg' alt='tinect' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/gega7' title='gega7: bug'><img src='https://avatars0.githubusercontent.com/u/20799911?v=4' alt='gega7' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/tristanplouz' title='tristanplouz: code, ideas, translation'><img src='https://avatars2.githubusercontent.com/u/6893466?v=4' alt='tristanplouz' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/dannyqiu' title='Danny Qiu: code, bug'><img src='https://avatars1.githubusercontent.com/u/1170755?v=4' alt='dannyqiu' style='width:100px;'/></a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/belyazidi56' title='Youssef Belyazidi: code'><img src='https://avatars3.githubusercontent.com/u/35711540?v=4' alt='belyazidi56' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/gabspeck' title='Gabriel Speckhahn: platform'><img src='https://avatars2.githubusercontent.com/u/749488?v=4' alt='gabspeck' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/dandelionadia' title='Nadiia Ridko: code'><img src='https://avatars0.githubusercontent.com/u/33199975?v=4' alt='dandelionadia' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://hohner.dev' title='Jan Hohner: userTesting, translation'><img src='https://avatars0.githubusercontent.com/u/649895?v=4' alt='janhohner' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://marussy.com' title='Kristóf Marussy: code, maintenance, review'><img src='https://avatars1.githubusercontent.com/u/38888?v=4' alt='kris7t' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://cl.linkedin.com/in/juanvalentinmoraruiz' title='Juan Mora: code'><img src='https://avatars0.githubusercontent.com/u/4575267?v=4' alt='raicerk' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://tofran.com' title='Francisco Marques: code'><img src='https://avatars2.githubusercontent.com/u/5692603?v=4' alt='tofran' style='width:100px;'/></a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href='https://digitalcoyote.github.io/NuGetDefense/' title='Curtis Carter: platform'><img src='https://avatars3.githubusercontent.com/u/16868093?v=4' alt='digitalcoyote' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/kawarimidoll' title='カワリミ人形: doc'><img src='https://avatars0.githubusercontent.com/u/8146876?v=4' alt='kawarimidoll' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://immortal-pc.info/' title='1mm0rt41PC: code'><img src='https://avatars0.githubusercontent.com/u/5358076?v=4' alt='1mm0rt41PC' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='http://code-addict.pl' title='Michał Kostewicz: code'><img src='https://avatars.githubusercontent.com/u/6313392?v=4' alt='k0staa' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://www.linkedin.com/in/yogainformatika/' title='Yoga Setiawan: code, platform'><img src='https://avatars.githubusercontent.com/u/1139881?v=4' alt='arioki1' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/MosheGross' title='Moshe Gross: code'><img src='https://avatars.githubusercontent.com/u/77084755?v=4' alt='MosheGross' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/stnkl' title='Stephan Rumswinkel: code, bug'><img src='https://avatars.githubusercontent.com/u/17520641?v=4' alt='stnkl' style='width:100px;'/></a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href='https://dustin.meecolabs.eu/' title='Dustin: design'><img src='https://avatars.githubusercontent.com/u/124467?v=4' alt='alopix' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/jakobsudau' title='Jakob Felix Julius Sudau: design'><img src='https://avatars.githubusercontent.com/u/721715?v=4' alt='jakobsudau' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://prasans.info' title='Prasanna: code'><img src='https://avatars.githubusercontent.com/u/380340?v=4' alt='prasann' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/markandan' title='Markandan R: code'><img src='https://avatars.githubusercontent.com/u/7975763?v=4' alt='markandan' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://markushatvan.com' title='Markus Hatvan: code, ideas, design, review, infra, translation'><img src='https://avatars.githubusercontent.com/u/16797721?v=4' alt='mhatvan' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://sergiu.dev/' title='Sergiu Ghitea: code'><img src='https://avatars.githubusercontent.com/u/28300158?v=4' alt='sergiughf' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/ArviTheMan' title='ArviTheMan: doc'><img src='https://avatars.githubusercontent.com/u/73516201?v=4' alt='ArviTheMan' style='width:100px;'/></a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href='https://bandism.net/' title='Ikko Ashimine: code'><img src='https://avatars.githubusercontent.com/u/22633385?v=4' alt='eltociear' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/madsmtm' title='Mads Marquart: translation'><img src='https://avatars.githubusercontent.com/u/10577181?v=4' alt='madsmtm' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='http://mateusz.loskot.net/' title='Mateusz Łoskot: doc'><img src='https://avatars.githubusercontent.com/u/80741?v=4' alt='mloskot' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/skoshy' title='Stefan K: doc'><img src='https://avatars.githubusercontent.com/u/369825?v=4' alt='skoshy' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/graves501' title='graves501: doc'><img src='https://avatars.githubusercontent.com/u/11211125?v=4' alt='graves501' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://www.ekino.com' title='Sadetdin EYILI: code, bug, userTesting'><img src='https://avatars.githubusercontent.com/u/5607440?v=4' alt='sad270' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/Tsakatac' title='Tsakatac: bug'><img src='https://avatars.githubusercontent.com/u/89021195?v=4' alt='Tsakatac' style='width:100px;'/></a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/MyUncleSam' title='MyUncleSam: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/15046019/small/d48a41a2a7e2d205dbe3316cd834dfb6.jpeg' alt='MyUncleSam' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/mcwladkoe' title='Vladyslav Samotoi: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/12996072/small/be802e915089a812d93e676674c9454f.png' alt='mcwladkoe' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/vyacheslav_malashin' title='Vyacheslav Malashin: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/15062315/small/397445945985e829703b1fe3e4f4ccf4.JPG' alt='vyacheslav_malashin' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/chatoskuntakinte' title='Chatos Kuntakinte: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/15062523/small/acb7763df860ca67fe30dbafcf9e31e0.png' alt='chatoskuntakinte' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/e0f' title='Juha Köpman: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/14443460/small/fda983d878c8cd64f9224d2c27a2a56c.jpg' alt='e0f' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/AiOO' title='AiOO: translation'><img src='https://www.gravatar.com/avatar/f39fe4e7e61f4aea84e369b5f9d9c2f6' alt='AiOO' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/musyawaroh123' title='Ibra AF: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/13583172/small/f3e47a6f884ad97a5a8d354f0fe5a853.jpg' alt='musyawaroh123' style='width:100px;'/></a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/bekwendhausen' title='Rebecca Wendhausen: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/15085045/small/3afbce411d873055baca51f69d3bfd8c.png' alt='bekwendhausen' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/dastillero' title='David Astillero Pérez: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/14935695/small/abf96cf0a2ccb90f0ffbd7ffad4bf6f0.jpeg' alt='dastillero' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/mscythe' title='mscythe: translation'><img src='https://www.gravatar.com/avatar/f5c7d39046e60be1692b03d09624a49e' alt='mscythe' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/Privatecoder' title='Privatecoder: userTesting'><img src='https://avatars.githubusercontent.com/u/45964815?v=4' alt='Privatecoder' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='http://lorenzolewis.click' title='Lorenzo Lewis: code'><img src='https://avatars.githubusercontent.com/u/15347255?v=4' alt='lorenzolewis' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/niebloomj' title='Baruch Jacob Niebloom: review'><img src='https://avatars.githubusercontent.com/u/5156403?v=4' alt='niebloomj' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/jamesandariese' title='James Andariese: code'><img src='https://avatars.githubusercontent.com/u/2583421?v=4' alt='jamesandariese' style='width:100px;'/></a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/Jipem' title='Jean-Pierre MÉRESSE: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/15101883/small/56a810446c7f1b7bfd566825bdf38f97.png' alt='Jipem' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/XianZongzi' title='咸粽子: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/13898579/small/a62e017825193da284eb84b7a318f6b7_default.png' alt='XianZongzi' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/barkinarga' title='Barkın Arga: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/12813629/small/44d528df52ccd5972d167835ace78078.jpg' alt='barkinarga' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/Droidnius' title='Santiago: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/14790068/small/2d824af4ac6a1f41f82b24020409ae44.jpg' alt='Droidnius' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/Radiquum' title='Kentai Radiquum: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/15166222/small/bb762aa8ef3fcac773487ef3ef8708ce.jpeg' alt='Radiquum' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/bymcs' title='Mehmet Can: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/15166456/small/c4d6a35eb95112121b167386c044967d.png' alt='bymcs' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://crowdin.com/profile/banhetom' title='banhetom: translation'><img src='https://crowdin-static.downloads.crowdin.com/avatar/15203804/small/b8dbe2bfd68c749f7965f39ede727882.png' alt='banhetom' style='width:100px;'/></a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href='https://elliotthiebaut.com' title='Elliot Thiebaut: bug'><img src='https://avatars.githubusercontent.com/u/60610988?v=4' alt='ElliotThiebaut' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/woropajj' title='Jakub: bug'><img src='https://avatars.githubusercontent.com/u/57800049?v=4' alt='woropajj' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/guillermin012' title='guillermin012: ideas'><img src='https://avatars.githubusercontent.com/u/76463041?v=4' alt='guillermin012' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/SpecialAro' title='André Oliveira: code, infra, design, bug, userTesting, review, ideas'><img src='https://avatars.githubusercontent.com/u/37463445?v=4' alt='SpecialAro' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/fernandofig' title='Fernando Figueiredo: code, design'><img src='https://avatars.githubusercontent.com/u/1110864?v=4' alt='fernandofig' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://meetfranz.com/' title='Harald: code'><img src='https://avatars.githubusercontent.com/u/135914?v=4' alt='haraldox' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='http://linkedin.com/in/phmigotto' title='Peter Migotto: code'><img src='https://avatars.githubusercontent.com/u/25492456?v=4' alt='phmigotto' style='width:100px;'/></a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/DBozhinovski' title='Darko Bozhinovski: code'><img src='https://avatars.githubusercontent.com/u/271746?v=4' alt='DBozhinovski' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://hrwg.de/' title='Rico Herwig: translation'><img src='https://avatars.githubusercontent.com/u/12065150?v=4' alt='rherwig' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/atakangktepe' title='Atakan Goktepe: code'><img src='https://avatars.githubusercontent.com/u/12830048?v=4' alt='atakangktepe' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/Jensderond' title='Jens de Rond: translation'><img src='https://avatars.githubusercontent.com/u/6972822?v=4' alt='Jensderond' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/michaelhays' title='Michael Hays: code'><img src='https://avatars.githubusercontent.com/u/6445661?v=4' alt='michaelhays' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/haveneersrobin' title='Robin Haveneers: translation'><img src='https://avatars.githubusercontent.com/u/7559898?v=4' alt='haveneersrobin' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://closingin.me/' title='Rémi Weislinger: code'><img src='https://avatars.githubusercontent.com/u/2735603?v=4' alt='closingin' style='width:100px;'/></a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/dnlup' title='dnlup: translation'><img src='https://avatars.githubusercontent.com/u/15520377?v=4' alt='dnlup' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://ywjameslin.tw/' title='YWJamesLin: translation'><img src='https://avatars.githubusercontent.com/u/4758887?v=4' alt='YWJamesLin' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/3b3ziz' title='Ahmad M. Abdelaziz: code'><img src='https://avatars.githubusercontent.com/u/11807541?v=4' alt='3b3ziz' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://hiro-group.ronc.one/' title='Alessandro Roncone: doc'><img src='https://avatars.githubusercontent.com/u/4378663?v=4' alt='alecive' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://csy54.github.io/' title='CSY54: code'><img src='https://avatars.githubusercontent.com/u/18496305?v=4' alt='CSY54' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://mazedlx.net/' title='Christian Leo-Pernold: doc'><img src='https://avatars.githubusercontent.com/u/9453522?v=4' alt='mazedlx' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://vaseker.ru/' title='Dmitry Vasilyev: translation'><img src='https://avatars.githubusercontent.com/u/1942271?v=4' alt='vaseker' style='width:100px;'/></a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/gkotian' title='Gautam Kotian: doc'><img src='https://avatars.githubusercontent.com/u/1580240?v=4' alt='gkotian' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/Guillerman' title='Guillerman: translation'><img src='https://avatars.githubusercontent.com/u/13747538?v=4' alt='Guillerman' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/jbellingham' title='Jesse Bellingham: infra'><img src='https://avatars.githubusercontent.com/u/5078290?v=4' alt='jbellingham' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://www.linkedin.com/in/konradkleine/' title='Konrad Kleine: infra'><img src='https://avatars.githubusercontent.com/u/193408?v=4' alt='kwk' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://frumania.com/' title='Marcel Törpe: code'><img src='https://avatars.githubusercontent.com/u/12220576?v=4' alt='frumania' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/melodywei861016' title='Melody Wei: code'><img src='https://avatars.githubusercontent.com/u/21094559?v=4' alt='melodywei861016' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='http://www.nielsbom.com/' title='Niels Bom: doc'><img src='https://avatars.githubusercontent.com/u/327080?v=4' alt='nielsbom' style='width:100px;'/></a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/dabalroman' title='Roman Dąbal: code'><img src='https://avatars.githubusercontent.com/u/13556759?v=4' alt='dabalroman' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/apo-mak' title='apo-mak: translation'><img src='https://avatars.githubusercontent.com/u/25563515?v=4' alt='apo-mak' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://lecroq.be/' title='Christopher Peeters: translation'><img src='https://avatars.githubusercontent.com/u/32568187?v=4' alt='cpeetersburg' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='http://www.codewars.com/users/grzeswol' title='Grzegorz Wolsza: translation'><img src='https://avatars.githubusercontent.com/u/2955105?v=4' alt='grzeswol' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/imaginarny' title='imaginarny: code'><img src='https://avatars.githubusercontent.com/u/20380121?v=4' alt='imaginarny' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/jaebradley' title='Jae Bradley: doc'><img src='https://avatars.githubusercontent.com/u/8136030?v=4' alt='jaebradley' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/skoruppa' title='skoruppa: code'><img src='https://avatars.githubusercontent.com/u/899429?v=4' alt='skoruppa' style='width:100px;'/></a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/NathanaelGandhi' title='Nathanael: infra, code'><img src='https://avatars.githubusercontent.com/u/36506137?v=4' alt='NathanaelGandhi' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/Evan-aja' title='Evan: infra'><img src='https://avatars.githubusercontent.com/u/71018479?v=4' alt='Evan-aja' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/cedricroijakkers' title='Cedric Roijakkers: infra'><img src='https://avatars.githubusercontent.com/u/15158042?v=4' alt='cedricroijakkers' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://kishaningithub.github.io/' title='Kishan B: infra'><img src='https://avatars.githubusercontent.com/u/763760?v=4' alt='kishaningithub' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/cm-schl' title='cm-schl: doc'><img src='https://avatars.githubusercontent.com/u/63400209?v=4' alt='cm-schl' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://santhosh.cyou' title='Santhosh C: code'><img src='https://avatars.githubusercontent.com/u/20743451?v=4' alt='santhosh-chinnasamy' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/Alt37' title='Alt37: bug'><img src='https://avatars.githubusercontent.com/u/44649402?v=4' alt='Alt37' style='width:100px;'/></a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/MagicLegend' title='MagicLegend: bug'><img src='https://avatars.githubusercontent.com/u/3169104?v=4' alt='MagicLegend' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/Alphrag' title='Alphrag: doc, infra'><img src='https://avatars.githubusercontent.com/u/34252790?v=4' alt='Alphrag' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='http://maxwipfli.ch' title='Max Wipfli: code'><img src='https://avatars.githubusercontent.com/u/17591869?v=4' alt='MaxWipfli' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/davidajetter-tw' title='davidajetter-tw: doc'><img src='https://avatars.githubusercontent.com/u/105304388?v=4' alt='davidajetter-tw' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/stacksjb' title='Jesse: doc'><img src='https://avatars.githubusercontent.com/u/2865491?v=4' alt='stacksjb' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='http://korepov.pro/' title='Alexey Murz Korepov: code'><img src='https://avatars.githubusercontent.com/u/336662?v=4' alt='MurzNN' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='http://www.realityloop.com/' title='Brian Gilbert: design'><img src='https://avatars.githubusercontent.com/u/114017?v=4' alt='BrianGilbert' style='width:100px;'/></a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href='https://amangalampalli.github.io/' title='Aditya Mangalampalli: design'><img src='https://avatars.githubusercontent.com/u/25261413?v=4' alt='amangalampalli' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='http://cino.io' title='Ricardo Cino: infra, code'><img src='https://avatars.githubusercontent.com/u/2735602?v=4' alt='cino' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://mrksr.de' title='Markus Kaiser: infra'><img src='https://avatars.githubusercontent.com/u/5184063?v=4' alt='mrksr' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/victorbnl' title='Victor B.: code, security'><img src='https://avatars.githubusercontent.com/u/39555268?v=4' alt='victorbnl' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://nils.fahldieck.de' title='Nils Fahldieck: doc'><img src='https://avatars.githubusercontent.com/u/16440184?v=4' alt='Rabattkarte' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://gitconvex.com/' title='Neel: code'><img src='https://avatars.githubusercontent.com/u/47709856?v=4' alt='neel1996' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://www.linkedin.com/in/pritamsangani/' title='Pritam Sangani: code'><img src='https://avatars.githubusercontent.com/u/22857896?v=4' alt='PritamSangani' style='width:100px;'/></a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/muhamedsalih-tw' title='muhamedsalih-tw: code'><img src='https://avatars.githubusercontent.com/u/104364298?v=4' alt='muhamedsalih-tw' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/balajiv113' title='Balaji Vijayakumar: code'><img src='https://avatars.githubusercontent.com/u/13016475?v=4' alt='balajiv113' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='http://blog.bacao.pt' title='André Bação: security'><img src='https://avatars.githubusercontent.com/u/17479246?v=4' alt='abacao' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://blog.wikichoon.com' title='Cole Robinson: doc'><img src='https://avatars.githubusercontent.com/u/1437464?v=4' alt='crobinso' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/deadmeu' title='deadmeu: code'><img src='https://avatars.githubusercontent.com/u/12111013?v=4' alt='deadmeu' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/MentorPK' title='Pawel Kowalski: code'><img src='https://avatars.githubusercontent.com/u/25907418?v=4' alt='MentorPK' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/mcmxcdev' title='MCMXC: code, infra'><img src='https://avatars.githubusercontent.com/u/16797721?v=4' alt='mcmxcdev' style='width:100px;'/></a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/xduugu' title='xduugu: infra'><img src='https://avatars.githubusercontent.com/u/1039174?v=4' alt='xduugu' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='http://www.willy-woitas.de' title='Willy Woitas: code'><img src='https://avatars.githubusercontent.com/u/14682?v=4' alt='dutscher' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='http://saru.moe' title='Danny Tsai: code'><img src='https://avatars.githubusercontent.com/u/3490463?v=4' alt='danny8376' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/insidewhy' title='insidewhy: code'><img src='https://avatars.githubusercontent.com/u/97685?v=4' alt='insidewhy' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/DenysMb' title='Denys Madureira: code'><img src='https://avatars.githubusercontent.com/u/33737137?v=4' alt='DenysMb' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/laur89' title='laur89: code'><img src='https://avatars.githubusercontent.com/u/4551018?v=4' alt='laur89' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='http://dxrcy.dev' title='darcy: code'><img src='https://avatars.githubusercontent.com/u/44690813?v=4' alt='dxrcy' style='width:100px;'/></a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/tomaszduda23' title='tomaszduda23: code'><img src='https://avatars.githubusercontent.com/u/35012788?v=4' alt='tomaszduda23' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/x-Ai' title='F。: code'><img src='https://avatars.githubusercontent.com/u/5061489?v=4' alt='x-Ai' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://blog.mbentley.net' title='Matt Bentley: code'><img src='https://avatars.githubusercontent.com/u/414445?v=4' alt='mbentley' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/jotardo' title='jotardo: code'><img src='https://avatars.githubusercontent.com/u/63938660?v=4' alt='jotardo' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://fcon.fedorapeople.org' title='Danilo Falcão: code'><img src='https://avatars.githubusercontent.com/u/4456855?v=4' alt='danilofalcao' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://kurobeats.github.io' title='Anthony Cozamanis: code'><img src='https://avatars.githubusercontent.com/u/4091936?v=4' alt='kurobeats' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://www.linkedin.com/in/joshuafreedman1/' title='Joshua Freedman: code'><img src='https://avatars.githubusercontent.com/u/5187100?v=4' alt='phelix001' style='width:100px;'/></a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href='http://auditore.com.br' title='Édipo Maciel | 'Shu': code'><img src='https://avatars.githubusercontent.com/u/4049331?v=4' alt='shuhikari' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='http://tobiasfluehmann.ch' title='Tobias Flühmann: code'><img src='https://avatars.githubusercontent.com/u/5341776?v=4' alt='tfluehmann' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://stevops.nl' title='Stefan van Essen: code'><img src='https://avatars.githubusercontent.com/u/1150201?v=4' alt='eXistenZNL' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='http://ritteralvaro.com' title='Alvaro Ritter Quevedo: code'><img src='https://avatars.githubusercontent.com/u/113945166?v=4' alt='ritteralvaro' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://songstats.com' title='Oskar Eichler: code'><img src='https://avatars.githubusercontent.com/u/62393985?v=4' alt='OskarEichler' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='http://www.tobez.org/' title='Anton Berezin: code'><img src='https://avatars.githubusercontent.com/u/63679?v=4' alt='tobez' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://alexcrooks.me' title='Alex: code'><img src='https://avatars.githubusercontent.com/u/1065835?v=4' alt='alexcroox' style='width:100px;'/></a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/tomaszduda23' title='tomaszduda23: code'><img src='https://avatars.githubusercontent.com/u/35012788?v=4' alt='tomaszduda23' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/x-Ai' title='F。: code'><img src='https://avatars.githubusercontent.com/u/5061489?v=4' alt='x-Ai' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://blog.mbentley.net' title='Matt Bentley: code'><img src='https://avatars.githubusercontent.com/u/414445?v=4' alt='mbentley' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://github.com/jotardo' title='jotardo: code'><img src='https://avatars.githubusercontent.com/u/63938660?v=4' alt='jotardo' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://fcon.fedorapeople.org' title='Danilo Falcão: code'><img src='https://avatars.githubusercontent.com/u/4456855?v=4' alt='danilofalcao' style='width:100px;'/></a></td>
      <td align="center" valign="top" width="14.28%"><a href='https://kurobeats.github.io' title='Anthony Cozamanis: code'><img src='https://avatars.githubusercontent.com/u/4091936?v=4' alt='kurobeats' style='width:100px;'/></a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
