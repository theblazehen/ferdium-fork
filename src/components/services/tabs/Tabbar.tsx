import { mdiChevronDown, mdiChevronRight } from '@mdi/js';
import { observer } from 'mobx-react';
import { Component } from 'react';

import { KEEP_WS_LOADED_USID } from '../../../config';
import { workspaceStore } from '../../../features/workspaces';
// FORK: import updateWorkspaceRequest directly to persist reorder without navigating
import { updateWorkspaceRequest } from '../../../features/workspaces/api';
import type Service from '../../../models/Service';
import Icon from '../../ui/icon';
import TabBarSortableList from './TabBarSortableList';

interface IProps {
  showMessageBadgeWhenMutedSetting: boolean;
  showServiceNameSetting: boolean;
  showMessageBadgesEvenWhenMuted: boolean;
  services: Service[];
  setActive: (args: { serviceId: string }) => void;
  openSettings: (args: { path: string }) => void;
  enableToolTip: () => void;
  disableToolTip: () => void;
  reorderUngrouped: (args: { oldIndex: number; newIndex: number }) => void;
  reload: (args: { serviceId: string }) => void;
  toggleNotifications: (args: { serviceId: string }) => void;
  toggleAudio: (args: { serviceId: string }) => void;
  toggleDarkMode: (args: { serviceId: string }) => void;
  deleteService: (args: { serviceId: string }) => void;
  clearCache: (args: { serviceId: string }) => void;
  hibernateService: (args: { serviceId: string }) => void;
  wakeUpService: (args: { serviceId: string }) => void;
  updateService: (args: {
    serviceId: string;
    serviceData: { isEnabled: boolean; isMediaPlaying: boolean };
    redirect: boolean;
  }) => void;
}

interface IState {
  collapsedGroups: Record<string, boolean>;
}

const COLLAPSE_STORAGE_KEY = 'ferdium-fork-workspace-sidebar-collapsed';

@observer
class TabBar extends Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      // FORK: persist workspace-group collapse state in localStorage.
      collapsedGroups: TabBar.loadCollapsedGroups(),
    };
  }

  static loadCollapsedGroups(): Record<string, boolean> {
    try {
      const raw = localStorage.getItem(COLLAPSE_STORAGE_KEY);
      if (!raw) {
        return {};
      }

      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  saveCollapsedGroups = () => {
    localStorage.setItem(
      COLLAPSE_STORAGE_KEY,
      JSON.stringify(this.state.collapsedGroups),
    );
  };

  toggleGroup = (groupId: string) => {
    this.setState(
      previousState => ({
        collapsedGroups: {
          ...previousState.collapsedGroups,
          [groupId]: !previousState.collapsedGroups[groupId],
        },
      }),
      this.saveCollapsedGroups,
    );
  };

  toggleService = (args: { serviceId: string; isEnabled: boolean }) => {
    const { updateService } = this.props;

    if (args.serviceId) {
      updateService({
        serviceId: args.serviceId,
        serviceData: {
          isEnabled: args.isEnabled,
          isMediaPlaying: false,
        },
        redirect: false,
      });
    }
  };

  disableService({ serviceId }) {
    this.toggleService({ serviceId, isEnabled: false });
  }

  enableService({ serviceId }) {
    this.toggleService({ serviceId, isEnabled: true });
  }

  hibernateService({ serviceId }) {
    if (serviceId) {
      this.props.hibernateService({ serviceId });
    }
  }

  wakeUpService({ serviceId }) {
    if (serviceId) {
      this.props.wakeUpService({ serviceId });
    }
  }

  buildGroups() {
    // FORK: Defensively guard against transient/malformed workspace payloads so
    // the sidebar never renders blank.
    const inputServices = Array.isArray(this.props.services)
      ? this.props.services
      : [];
    const serviceById = new Map(
      inputServices.map(service => [service.id, service]),
    );
    const assignedServiceIds = new Set<string>();
    const groups: {
      id: string;
      title: string;
      services: Service[];
      workspace: any;
      isUngrouped: boolean;
    }[] = [];

    const workspaces = Array.isArray(workspaceStore.workspaces)
      ? workspaceStore.workspaces
      : [];

    for (const workspace of workspaces) {
      const workspaceServiceIds = Array.isArray(workspace?.services)
        ? workspace.services
        : [];
      const workspaceServices = workspaceServiceIds
        .filter(serviceId => serviceId !== KEEP_WS_LOADED_USID)
        .map(serviceId => serviceById.get(serviceId))
        .filter(Boolean) as Service[];

      for (const service of workspaceServices) {
        assignedServiceIds.add(service.id);
      }

      groups.push({
        // FORK: render a dedicated section for each workspace.
        id: `workspace-${workspace.id}`,
        // FORK: guard against null workspace.name rendering as literal "null"
        title: workspace.name || 'Unnamed',
        services: workspaceServices,
        workspace,
        isUngrouped: false,
      });
    }

    const ungroupedServices = inputServices.filter(
      service => !assignedServiceIds.has(service.id),
    );

    groups.push({
      id: 'workspace-ungrouped',
      title: 'Ungrouped',
      services: ungroupedServices,
      workspace: null,
      isUngrouped: true,
    });

    return groups;
  }

  reorderWorkspaceServices = (
    workspace,
    services: Service[],
    oldIndex: number,
    newIndex: number,
  ) => {
    // FORK: Only reorder visible services, preserving disabled/hidden service IDs
    // in their original positions within the full workspace.services array.
    const visibleIds = services.map(service => service.id);
    const reordered = [...visibleIds];
    reordered.splice(newIndex, 0, reordered.splice(oldIndex, 1)[0]);

    const fullServices: string[] = [...workspace.services];
    const visibleSet = new Set(visibleIds);

    // Replace visible IDs in-place with reordered ones, skip non-visible IDs
    let reorderIdx = 0;
    const rebuilt: string[] = [];
    for (const id of fullServices) {
      if (visibleSet.has(id)) {
        rebuilt.push(reordered[reorderIdx]);
        reorderIdx += 1;
      } else {
        rebuilt.push(id);
      }
    }

    // FORK: persist order changes within a workspace group.
    workspace.services.splice(0, workspace.services.length, ...rebuilt);
    // FORK: use updateWorkspaceRequest directly to avoid store._update navigating to settings
    updateWorkspaceRequest.execute(workspace);
  };

  reorderUngroupedServices = (
    groupServices: Service[],
    oldIndex: number,
    newIndex: number,
  ) => {
    const oldService = groupServices[oldIndex];
    const newService = groupServices[newIndex];
    if (!oldService || !newService) {
      return;
    }

    const allServices = this.props.services;
    const oldGlobalIndex = allServices.findIndex(s => s.id === oldService.id);
    const newGlobalIndex = allServices.findIndex(s => s.id === newService.id);

    if (oldGlobalIndex === -1 || newGlobalIndex === -1) {
      return;
    }

    // FORK: reorder the ungrouped services using global service order.
    this.props.reorderUngrouped({
      oldIndex: oldGlobalIndex,
      newIndex: newGlobalIndex,
    });
  };

  onSortEndByGroup =
    group =>
    ({ oldIndex, newIndex }) => {
      if (oldIndex === newIndex) {
        return;
      }

      this.props.enableToolTip();

      if (group.isUngrouped) {
        this.reorderUngroupedServices(group.services, oldIndex, newIndex);
        return;
      }

      this.reorderWorkspaceServices(
        group.workspace,
        group.services,
        oldIndex,
        newIndex,
      );
    };

  render() {
    const {
      setActive,
      openSettings,
      disableToolTip,
      reload,
      toggleNotifications,
      toggleAudio,
      toggleDarkMode,
      deleteService,
      clearCache,
      showMessageBadgeWhenMutedSetting,
      showServiceNameSetting,
      showMessageBadgesEvenWhenMuted,
    } = this.props;

    const groups = this.buildGroups();
    const totalServices = groups.reduce(
      (count, group) => count + group.services.length,
      0,
    );
    let shortcutIndexOffset = 0;

    if (totalServices === 0) {
      return (
        <div className="sidebar__services">
          <section className="sidebar__workspace-group">
            <button
              type="button"
              className="sidebar__workspace-group-header"
              onClick={() => this.toggleGroup('workspace-ungrouped')}
            >
              <Icon
                icon={
                  this.state.collapsedGroups['workspace-ungrouped']
                    ? mdiChevronRight
                    : mdiChevronDown
                }
                size={0.9}
              />
              <span className="sidebar__workspace-group-title">
                Ungrouped (0)
              </span>
            </button>
            {this.state.collapsedGroups['workspace-ungrouped'] ? null : (
              <div className="sidebar__empty-state">
                {/* FORK: make empty services state explicit instead of blank sidebar */}
                No services yet
              </div>
            )}
          </section>
        </div>
      );
    }

    return (
      <div className="sidebar__services">
        {groups.map(group => {
          const isCollapsed = Boolean(this.state.collapsedGroups[group.id]);
          const currentShortcutOffset = shortcutIndexOffset;
          shortcutIndexOffset += group.services.length;

          return (
            <section className="sidebar__workspace-group" key={group.id}>
              <button
                type="button"
                className="sidebar__workspace-group-header"
                onClick={() => this.toggleGroup(group.id)}
              >
                <Icon
                  icon={isCollapsed ? mdiChevronRight : mdiChevronDown}
                  size={0.9}
                />
                <span className="sidebar__workspace-group-title">
                  {group.title} ({group.services.length})
                </span>
              </button>
              {isCollapsed ? null : (
                <TabBarSortableList
                  // @ts-expect-error Fix me
                  services={group.services}
                  setActive={setActive}
                  onSortEnd={this.onSortEndByGroup(group)}
                  onSortStart={disableToolTip}
                  reload={reload}
                  toggleNotifications={toggleNotifications}
                  toggleAudio={toggleAudio}
                  toggleDarkMode={toggleDarkMode}
                  deleteService={deleteService}
                  clearCache={clearCache}
                  disableService={args => this.disableService(args)}
                  enableService={args => this.enableService(args)}
                  hibernateService={args => this.hibernateService(args)}
                  wakeUpService={args => this.wakeUpService(args)}
                  openSettings={openSettings}
                  distance={20}
                  axis="y"
                  lockAxis="y"
                  helperClass="is-reordering"
                  showMessageBadgeWhenMutedSetting={
                    showMessageBadgeWhenMutedSetting
                  }
                  showServiceNameSetting={showServiceNameSetting}
                  showMessageBadgesEvenWhenMuted={
                    showMessageBadgesEvenWhenMuted
                  }
                  shortcutIndexOffset={currentShortcutOffset}
                  groupId={group.id}
                />
              )}
            </section>
          );
        })}
      </div>
    );
  }
}

export default TabBar;
