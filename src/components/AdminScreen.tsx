import * as React from "react";
import { ScrollView, alert, confirm } from "@nativescript/core";
import { useSlackStore } from "../store/slackStore";

export function AdminScreen() {
    const { 
        apiKey, 
        loading, 
        fetchConfigs,
        setApiKey,
        fetchUsers,
        updateFetchConfig 
    } = useSlackStore();

    const [inputKey, setInputKey] = React.useState(apiKey || "");

    const onTestConnection = async () => {
        if (!inputKey) {
            alert({
                title: "Error",
                message: "Please enter an API key",
                okButtonText: "OK"
            });
            return;
        }

        try {
            await setApiKey(inputKey);
            await fetchUsers();
            const result = await confirm({
                title: "Success",
                message: "Connection successful! Save this API key?",
                okButtonText: "Save",
                cancelButtonText: "Cancel"
            });
            
            if (!result) {
                setInputKey("");
            }
        } catch (error) {
            alert({
                title: "Error",
                message: error.message || "Connection failed",
                okButtonText: "OK"
            });
        }
    };

    return (
        <scrollView>
            <stackLayout className="p-4">
                <label className="text-xl" text="Slack API Configuration" />
                
                <textField
                    className="input"
                    hint="Enter Slack Bot API Key"
                    text={inputKey}
                    onTextChange={(args) => setInputKey(args.object.text)}
                    secure={true}
                />

                <button
                    className="btn"
                    text={loading ? "Testing..." : "Test Connection"}
                    onTap={onTestConnection}
                    isEnabled={!loading && inputKey.length > 0}
                />

                <label className="text-xl" text="Data Fetch Settings" />
                
                {fetchConfigs.map((config, index) => (
                    <stackLayout key={config.type} className="p-4 m-2">
                        <label text={config.type.charAt(0).toUpperCase() + config.type.slice(1)} className="text-lg" />
                        
                        <gridLayout columns="auto, *, auto" className="m-2">
                            <switch 
                                col={0} 
                                checked={config.autoFetch}
                                onCheckedChange={(args) => updateFetchConfig(index, { autoFetch: args.value })}
                            />
                            <label col={1} text="Auto Fetch" className="m-2" />
                            <textField
                                col={2}
                                hint="Minutes"
                                keyboardType="number"
                                text={config.interval?.toString()}
                                onTextChange={(args) => updateFetchConfig(index, { 
                                    interval: parseInt(args.object.text) 
                                })}
                                className="input"
                            />
                        </gridLayout>
                    </stackLayout>
                ))}
            </stackLayout>
        </scrollView>
    );
}