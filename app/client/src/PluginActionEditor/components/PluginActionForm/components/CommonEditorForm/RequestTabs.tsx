import styled from "styled-components";
import { Tab, TabPanel, Tabs, TabsList } from "@appsmith/ads";
import FormLabel from "components/editorComponents/FormLabel";
import type { AutoGeneratedHeader } from "pages/Editor/APIEditor/helpers";
import type { EditorTheme } from "components/editorComponents/CodeEditor/EditorConfig";
import React from "react";
import { API_EDITOR_TABS } from "../../../../constants/CommonApiConstants";
import { DatasourceConfig } from "./components/DatasourceConfig";
import KeyValueFieldArray from "components/editorComponents/form/fields/KeyValueFieldArray";
import ApiAuthentication from "./components/ApiAuthentication";
import ActionSettings from "pages/Editor/ActionSettings";
import { API_EDITOR_TAB_TITLES, createMessage } from "ee/constants/messages";
import { useSelectedFormTab } from "./hooks/useSelectedFormTab";
import { getHeadersCount, getParamsCount } from "./utils";
import type { Property } from "entities/Action";

const SettingsWrapper = styled.div`
  padding: var(--ads-v2-spaces-4) 0;
  height: 100%;

  ${FormLabel} {
    padding: 0;
  }
`;
const TabsListWrapper = styled.div`
  padding: 0 var(--ads-v2-spaces-7);
`;
const StyledTabPanel = styled(TabPanel)`
  height: calc(100% - 50px);
  overflow: auto;
  padding: 0 var(--ads-v2-spaces-7);
`;

export function RequestTabs(props: {
  autogeneratedHeaders: AutoGeneratedHeader[] | undefined;
  datasourceHeaders: Property[];
  actionConfigurationHeaders: Property[];
  actionName: string;
  pushFields: boolean;
  theme: EditorTheme.LIGHT;
  datasourceParams: Property[];
  actionConfigurationParams: Property[];
  bodyUIComponent: React.ReactNode;
  paginationUiComponent: React.ReactNode;
  formName: string;
  showSettings: boolean;
  // TODO: Fix this the next time the file is edited
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actionSettingsConfig?: any;
}) {
  const [value, onValueChange] = useSelectedFormTab();
  const headersCount = getHeadersCount(
    props.actionConfigurationHeaders,
    props.datasourceHeaders,
    props.autogeneratedHeaders,
  );

  const paramsCount = getParamsCount(
    props.actionConfigurationParams,
    props.datasourceHeaders,
  );

  return (
    <Tabs className="h-full" onValueChange={onValueChange} value={value}>
      <TabsListWrapper>
        <TabsList>
          {Object.values(API_EDITOR_TABS)
            .filter((tab) => {
              return !(!props.showSettings && tab === API_EDITOR_TABS.SETTINGS);
            })
            .map((tab) => (
              <Tab
                data-testid={`t--api-editor-${tab}`}
                key={tab}
                notificationCount={
                  tab == "HEADERS"
                    ? headersCount
                    : tab == "PARAMS"
                      ? paramsCount
                      : undefined
                }
                value={tab}
              >
                {createMessage(API_EDITOR_TAB_TITLES[tab])}
              </Tab>
            ))}
        </TabsList>
      </TabsListWrapper>
      <StyledTabPanel value={API_EDITOR_TABS.HEADERS}>
        <DatasourceConfig
          attributeName="header"
          autogeneratedHeaders={props.autogeneratedHeaders}
          data={props.datasourceHeaders}
        />
        <KeyValueFieldArray
          actionConfig={props.actionConfigurationHeaders}
          dataTreePath={`${props.actionName}.config.headers`}
          hideHeader
          label="Headers"
          name="actionConfiguration.headers"
          placeholder="Value"
          pushFields={props.pushFields}
          theme={props.theme}
        />
      </StyledTabPanel>
      <StyledTabPanel value={API_EDITOR_TABS.PARAMS}>
        <DatasourceConfig
          attributeName={"param"}
          data={props.datasourceParams}
        />
        <KeyValueFieldArray
          actionConfig={props.actionConfigurationParams}
          dataTreePath={`${props.actionName}.config.queryParameters`}
          hideHeader
          label="Params"
          name="actionConfiguration.queryParameters"
          pushFields={props.pushFields}
          theme={props.theme}
        />
      </StyledTabPanel>
      <StyledTabPanel className="h-full" value={API_EDITOR_TABS.BODY}>
        {props.bodyUIComponent}
      </StyledTabPanel>
      <StyledTabPanel value={API_EDITOR_TABS.PAGINATION}>
        {props.paginationUiComponent}
      </StyledTabPanel>
      <StyledTabPanel value={API_EDITOR_TABS.AUTHENTICATION}>
        <ApiAuthentication formName={props.formName} />
      </StyledTabPanel>
      {props.showSettings ? (
        <StyledTabPanel value={API_EDITOR_TABS.SETTINGS}>
          <SettingsWrapper>
            <ActionSettings
              actionSettingsConfig={props.actionSettingsConfig}
              formName={props.formName}
              theme={props.theme}
            />
          </SettingsWrapper>
        </StyledTabPanel>
      ) : null}
    </Tabs>
  );
}
