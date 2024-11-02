import * as React from "react";
import { ObservableArray } from '@nativescript/core';
import type { SlackChannel } from '../types/slack';

export function ChannelsScreen() {
    const [channels] = React.useState(new ObservableArray<SlackChannel>([]));

    return (
        <stackLayout className="p-4">
            <label className="text-xl" text="Channels" />
            <listView
                items={channels}
                className="list-group"
            >
                <listView.itemTemplate>
                    <label text="{{ name }}" className="p-2" />
                </listView.itemTemplate>
            </listView>
        </stackLayout>
    );
}