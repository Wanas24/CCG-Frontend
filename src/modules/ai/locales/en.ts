const ai = {
  "title": "AI Assistant",
  "launcher": {
    "open": "Open AI assistant",
    "close": "Close AI assistant",
    "hint": "Need assistance?"
  },
  "panel": {
    "close": "Close AI assistant"
  },
  "sidebar": {
    "newChat": "New chat",
    "conversations": "Conversations",
    "emptyList": "Your conversations will appear here.",
    "empty": "No conversations yet.",
    "today": "Today",
    "yesterday": "Yesterday",
    "older": "Older",
    "loading": "Loading conversations...",
    "loadError": "Failed to load conversations."
  },
  "chat": {
    "newConversation": "New conversation",
    "openChats": "Open conversations",
    "openUsage": "Open usage and limits",
    "emptyTitle": "How can I help you today?",
    "loadingMessages": "Loading messages...",
    "loadMessagesError": "Failed to load messages.",
    "loadingOlder": "Loading older messages...",
    "thinking": "AI is thinking...",
    "sendError": "Failed to send message. Please try again."
  },
  "response": {
    "toolsUsed": "Tools used",
    "selectedCapabilities": "Selected capabilities",
    "warnings": "Warnings",
    "sources": "Sources",
    "artifacts": "Artifacts",
    "download": "Download",
    "transcript": "Transcript"
  },
  "composer": {
    "label": "Message",
    "placeholder": "Type your message...",
    "attach": "Attach files",
    "attachments": "Attachments",
    "voice": "Record a voice message",
    "voiceReady": "Voice message ready",
    "voiceMessage": "Voice message",
    "attachmentMessage": "Attachment",
    "recording": "Recording… {{duration}}",
    "stopRecording": "Stop recording",
    "discardVoice": "Discard recording",
    "sendVoice": "Send voice message",
    "send": "Send message",
    "sending": "Sending...",
    "cancel": "Cancel request",
    "stopGenerating": "Stop generating",
    "removeAttachment": "Remove {{name}}",
    "unknownType": "Unknown type",
    "emptySend": "Add a message or voice note to send.",
    "messageTooLong": "Message cannot exceed {{max}} characters.",
    "tooManyAttachments": "You can attach up to {{max}} files.",
    "attachmentTooLarge": "{{name}} exceeds the {{maxMb}} MB limit.",
    "audioTooLarge": "Audio cannot exceed {{maxMb}} MB.",
    "audioUnsupported": "This audio format is not supported.",
    "micPermissionDenied": "Microphone permission was denied.",
    "recordingUnsupported": "Voice recording is not supported in this browser.",
    "recordingFailed": "Unable to start voice recording."
  },
  "usage": {
    "title": "Usage & limits",
    "tokens": "Tokens",
    "messages": "Messages",
    "used": "Used",
    "remaining": "Remaining",
    "unlimited": "Unlimited",
    "loading": "Loading usage…",
    "errorTitle": "Unable to load usage",
    "errorDescription": "Usage information could not be loaded. Please try again.",
    "retry": "Retry",
    "period": "Current period",
    "periodUnavailable": "Usage information is currently unavailable.",
    "active": "Active",
    "notActive": "Not Active"
  },
  "subscriptions": {
    "title": "AI Subscription Management",
    "navLabel": "AI Subscriptions",
    "description": "Manage AI access and usage limits for company users",
    "searchPlaceholder": "Search users…",
    "drawerTitle": "User AI Subscription",
    "viewEdit": "View / Edit",
    "save": "Save changes",
    "cancel": "Cancel",
    "saveSuccess": "Subscription updated successfully",
    "loadingDetails": "Loading subscription…",
    "loadError": "Unable to load subscription data. Please try again.",
    "retry": "Retry",
    "empty": "No users found",
    "emptyValue": "—",
    "noPermission": "You do not have permission to view AI subscriptions.",
    "subscribed": "Subscribed",
    "notSubscribed": "Not subscribed",
    "unlimited": "Unlimited",
    "tokensShort": "tokens",
    "messagesShort": "messages",
    "paginationTotal": "{{from}}–{{to}} of {{total}}",
    "columns": {
      "user": "User",
      "email": "Email",
      "role": "Role",
      "subscription": "AI Subscription",
      "renewalDate": "Renewal Date",
      "usage": "Usage",
      "actions": "Actions"
    },
    "role": {
      "manager": "Manager",
      "employee": "Employee"
    },
    "filters": {
      "manager": "Role",
      "managerAll": "All roles",
      "managers": "Managers",
      "nonManagers": "Non-managers"
    },
    "sections": {
      "subscription": "Subscription",
      "usage": "Usage",
      "configuration": "Configuration"
    },
    "fields": {
      "isSubscribed": "Subscribed",
      "from": "From",
      "to": "To / Renewal",
      "unlimited": "Unlimited usage",
      "monthlyTokens": "Monthly tokens",
      "monthlyMessages": "Monthly messages",
      "historyMessages": "History messages",
      "historyMessagesHint": "The default is 10 messages. Increasing this value gives the AI more conversation context and may improve response accuracy, but it also consumes more tokens."
    },
    "validation": {
      "integer": "Enter a whole number",
      "nonNegative": "Value cannot be negative",
      "historyRange": "History messages must be between 0 and 100",
      "dateRange": "End date must be on or after the start date"
    }
  }
} as const;

export default ai;
