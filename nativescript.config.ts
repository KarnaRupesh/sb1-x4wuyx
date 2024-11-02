import { NativeScriptConfig } from '@nativescript/core';

export default {
    id: 'org.nativescript.slackmanager',
    appPath: 'src',
    appResourcesPath: 'App_Resources',
    android: {
        v8Flags: '--expose_gc',
        markingMode: 'none',
        codeCache: true,
        enableScreenCaptures: true
    },
    cssParser: 'rework',
    main: 'app'
} as NativeScriptConfig;