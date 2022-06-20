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

import { isFeatureEnabled } from "@wso2is/core/helpers";
import { SBACInterface } from "@wso2is/core/models";
import { Field, Forms, Validation } from "@wso2is/forms";
import { FormValidation } from "@wso2is/validation";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Form, Grid, Icon, List } from "semantic-ui-react";
import {  } from "../../../api";
import { MFAIcons } from "../../../configs";
import { CommonConstants } from "../../../constants";
import { AlertInterface, AlertLevels, BasicProfileInterface, FeatureConfigInterface } from "../../../models";
import { AppState } from "../../../store";
import { getProfileInformation, setActiveForm } from "../../../store/actions";
import { ModalComponent, EditSection, ThemeIcon } from "../../shared";
import {  } from "../../../constants";

interface RSAUProps extends SBACInterface<FeatureConfigInterface> {
    onAlertFired: (alert: AlertInterface) => void;
}


export const RSAuthenticator: React.FunctionComponent<RSAUProps> = (props: RSAUProps): JSX.Element => {

    const { t } = useTranslation();
    const { onAlertFired, featureConfig } = props;
    const dispatch = useDispatch();
    const [isConfirmVisible, setConfirmVisibility] = useState(false);
    const profileInfo: BasicProfileInterface = useSelector(
        (state: any) => state.authenticationInformation.profileInfo
    );
    const activeForm: string = useSelector((state: AppState) => state.global.activeForm);

    useEffect(() => {
        if (isEmpty(profileInfo)) {
            dispatch(getProfileInformation());
        }
    }, []);

    const updateResetModal = () => {
        setConfirmVisibility(false)
        // code api
        onAlertFired({
            description: t(
                "userPortal:components.rsa.notifications.updateMobile.success.description"
            ),
            level: AlertLevels.SUCCESS,
            message: t(
                "userPortal:components.rsa.notifications.updateMobile.success.message"
            )
        });

    };

    const handleEdit = () => {
        dispatch(setActiveForm(CommonConstants.AUTH));
    };

    const handleCancel = () => {
        dispatch(setActiveForm(null));
    };

    const handleCancelModal = () => {
        setConfirmVisibility(false)
    };

    const showEditView = () => {
        if (activeForm !== CommonConstants.AUTH) {

            return (
                <Grid padded={true}>
                    <Grid.Row columns={2}>
                        <Grid.Column width={11} className="first-column">
                            <List.Content floated="left">
                                <ThemeIcon
                                    icon={MFAIcons.authenticatorApp}
                                    size="mini"
                                    twoTone={true}
                                    transparent={true}
                                    square={true}
                                    rounded={true}
                                    relaxed={true}
                                />
                            </List.Content>
                            <List.Content>
                                <List.Header>{t("userPortal:components.rsa.resetauthenticator.heading")}</List.Header>
                                <List.Description>
                                    {t("userPortal:components.rsa.resetauthenticator.descriptions.hint")}
                                </List.Description>
                            </List.Content>
                        </Grid.Column>
                        <Grid.Column width={5} className="last-column">
                            <List.Content floated="right">
                                <Icon
                                    link={true}
                                    onClick={handleEdit}
                                    className="list-icon"
                                    size="small"
                                    color="grey"
                                    name="pencil alternate"
                                />
                            </List.Content>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }
        return (
            <EditSection>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <List>
                                <List.Item>
                                    <List.Content>
                                        <Forms>
                                            <Field
                                                autoFocus={true}
                                                readOnly={true}
                                                label={t(
                                                    "userPortal:components.rsa.form.inputs" +
                                                    ".mobile.label"
                                                )}
                                                name="mobileNumber"
                                                placeholder={t(
                                                    "userPortal:components.rsa.form" +
                                                    ".inputs.mobile.placeholder"
                                                )}
                                                required={false}
                                                requiredErrorMessage={t(
                                                    "userPortal:components.rsa.form.inputs" +
                                                    ".mobile.validations.empty"
                                                )}
                                                type="text"
                                                validation={(value: string, validation: Validation) => {
                                                    if (!FormValidation.mobileNumber(value)) {
                                                        validation.isValid = false;
                                                        validation.errorMessages.push(t(
                                                            "userPortal:components.rsa.form.inputs" +
                                                            ".mobile.validations.invalidFormat"
                                                        ));
                                                    }
                                                }}
                                                value={""}
                                            />
                                            <p style={{ fontSize: "12px" }}>
                                                <Icon color="grey" floated="left" name="info circle" />
                                                {t(
                                                    "userPortal:components.rsa.form" +
                                                    ".inputs.mobile.note"
                                                )}
                                            </p>
                                            <Field
                                                hidden={true}
                                                type="divider"
                                            />

                                            <Form.Group>
                                                <Field
                                                    onClick={() => {
                                                        setConfirmVisibility(!isConfirmVisible)
                                                    }}
                                                    size="small"
                                                    type="button"
                                                    value={t("common:reset").toString()}
                                                />
                                                <Field
                                                    className="link-button"
                                                    onClick={handleCancel}
                                                    size="small"
                                                    type="button"
                                                    value={t("common:cancel").toString()}
                                                />
                                            </Form.Group>
                                        </Forms>
                                    </List.Content>
                                </List.Item>
                            </List>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

                <ModalComponent
                    primaryAction={t("common:reset")}
                    secondaryAction={t("common:cancel")}
                    onSecondaryActionClick={handleCancelModal}
                    onPrimaryActionClick={updateResetModal}
                    open={isConfirmVisible}
                    type="warning"
                    header={t("userPortal:components.rsa.modals.confirm.heading")}
                    content={t("userPortal:components.rsa.modals.confirm.description")}
                >
                </ModalComponent>
                
            </EditSection>
        )
    };

    return <div>{showEditView()}</div>;

};