import * as React from "react";
import { ObservableArray } from '@nativescript/core';
import type { SlackUser } from '../types/slack';

export function UsersScreen() {
    const [users] = React.useState(new ObservableArray<SlackUser>([]));

    return (
        <stackLayout className="p-4">
            <label className="text-xl" text="Users" />
            <listView
                items={users}
                className="list-group"
            >
                <listView.itemTemplate>
                    <label text="{{ name }}" className="p-2" />
                </listView.itemTemplate>
            </listView>
        </stackLayout>
    );
}