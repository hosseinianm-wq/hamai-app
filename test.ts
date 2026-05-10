import voiceEvents from "@voice/events/voiceEvents"

import { VoiceStateMachine } from "./core/runtime/VoiceStateMachine"
import { VoiceOrchestrator } from "./core/runtime/VoiceOrchestrator"

import "./features/voice/engines/speechBuffer"

import { MockWakeEngine } from "./core/engines/mock/MockWakeEngine"
import { MockSpeechEngine } from "./core/engines/mock/MockSpeechEngine"
import { MockAIEngine } from "./core/engines/mock/MockAIEngine"
import { MockTTSEngine } from "./core/engines/mock/MockTTSEngine"

const state = new VoiceStateMachine()

const orchestrator = new VoiceOrchestrator(
  voiceEvents,
  state
)

new MockWakeEngine(voiceEvents).start()
new MockSpeechEngine(voiceEvents)
new MockAIEngine(voiceEvents)
new MockTTSEngine(voiceEvents)

orchestrator.start()
