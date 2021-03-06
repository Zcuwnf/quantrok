/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import { SBACInterface } from "@wso2is/core/models";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { List } from "semantic-ui-react";
import { AppConstants } from "../../constants";
import { AlertInterface, FeatureConfigInterface } from "../../models";
import { AppState } from "../../store";
import { SettingsSection } from "../shared";
import { RSAuthenticator } from "./authenticators/reset-authent";

/**
 * Prop types for the basic details component.
 */
interface RsaProps extends SBACInterface<FeatureConfigInterface> {
    onAlertFired: (alert: AlertInterface) => void;
}

export const ResetAuthenticator: React.FunctionComponent<RsaProps> = (props: RsaProps): JSX.Element => {
    const { t } = useTranslation();
    const { onAlertFired, featureConfig } = props;

    const allowedScopes: string = useSelector((state: AppState) => state?.authenticationInformation?.scope);
    const isReadOnlyUser = useSelector((state: AppState) => state.authenticationInformation.profileInfo.isReadOnly);

    return (
        <SettingsSection
            description={ t("userPortal:sections.rsa.description") }
            header={ t("userPortal:sections.rsa.heading") }
        >
            <List divided={ true } verticalAlign="middle" className="main-content-inner">
                { !isReadOnlyUser
                    && hasRequiredScopes(featureConfig?.security, featureConfig?.security?.scopes?.read, allowedScopes)
                    && isFeatureEnabled(
                        featureConfig?.security,
                        AppConstants.FEATURE_DICTIONARY.get("RESET_AUTHENTICATOR")
                    ) ? (
                        <List.Item className="inner-list-item">
                            <RSAuthenticator
                                featureConfig={ featureConfig }
                                onAlertFired={ onAlertFired }
                            />
                        </List.Item>
                    ) : null }

            </List>
        </SettingsSection>
    );
};
