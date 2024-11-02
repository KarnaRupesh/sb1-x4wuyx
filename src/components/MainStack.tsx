import * as React from "react";
import { TabView, TabViewItem } from "@nativescript/core";
import { AdminScreen } from "./AdminScreen";
import { ChannelsScreen } from "./ChannelsScreen";
import { UsersScreen } from "./UsersScreen";

export function MainStack() {
    return (
        <gridLayout rows="auto,*">
            <actionBar row={0} title="Slack Manager" />
            <tabView row={1} selectedIndex={0} androidTabsPosition="bottom">
                <tabViewItem title="Admin">
                    <gridLayout>
                        <AdminScreen />
                    </gridLayout>
                </tabViewItem>
                <tabViewItem title="Channels">
                    <gridLayout>
                        <ChannelsScreen />
                    </gridLayout>
                </tabViewItem>
                <tabViewItem title="Users">
                    <gridLayout>
                        <UsersScreen />
                    </gridLayout>
                </tabViewItem>
            </tabView>
        </gridLayout>
    );
}