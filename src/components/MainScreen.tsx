import * as React from "react";
import { StackLayout, Label, Button } from "@nativescript/core";

export function MainScreen() {
    return (
        <stackLayout className="p-4">
            <label className="text-2xl font-bold text-center" text="Slack Manager" />
            <button className="btn btn-primary m-4" text="Test Button" onTap={() => alert('Working!')} />
        </stackLayout>
    );
}