import * as React from "react";
import { MainStack } from "./MainStack";

export function AppContainer() {
    return (
        <gridLayout rows="*">
            <MainStack />
        </gridLayout>
    );
}