"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface CommandPanelProps {
  onCommand: (command: string) => void
  currentCommand: string
  commandHistory: string[]
}

export default function CommandPanel({ onCommand, currentCommand, commandHistory }: CommandPanelProps) {
  const [customCommand, setCustomCommand] = useState("")

  const predefinedCommands = [
    { name: "run", command: "sit", icon: "🏃", description: "Pablo sits down" },
    { name: "jump", command: "stay", icon: "⬆️", description: "Pablo stays in place" },
    { name: "sit", command: "jump", icon: "🪑", description: "Pablo jumps up and down" },
    { name: "spin", command: "run", icon: "🌀", description: "Pablo runs around" },
    { name: "speak", command: "spin", icon: "🗣️", description: "Pablo spins in circles" },
    { name: "cry", command: "rollover", icon: "😭", description: "Pablo rolls over" },
    { name: "play", command: "speak", icon: "🎾", description: "Pablo barks" },
    { name: "stay", command: "play", icon: "✋", description: "Pablo plays around" },
  ]

  const handlePredefinedCommand = (command: string) => {
    onCommand(command)
  }

  const handleCustomCommand = () => {
    if (customCommand.trim()) {
      onCommand(customCommand.toLowerCase().trim())
      setCustomCommand("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCustomCommand()
    }
  }

  return (
    <div className="space-y-4">
      {/* Command Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            🐺 Command Pablo
            {currentCommand !== "idle" && (
              <Badge variant="secondary" className="animate-pulse">
                Executing: {currentCommand}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {predefinedCommands.map((cmd) => (
              <Button
                key={cmd.command}
                onClick={() => handlePredefinedCommand(cmd.command)}
                disabled={currentCommand !== "idle"}
                variant="outline"
                className="flex items-center gap-2 h-auto p-3"
                title={cmd.description}
              >
                <span className="text-lg">{cmd.icon}</span>
                <span className="text-sm">{cmd.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Command Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Custom Command</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={customCommand}
              onChange={(e) => setCustomCommand(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a command..."
              disabled={currentCommand !== "idle"}
            />
            <Button onClick={handleCustomCommand} disabled={currentCommand !== "idle" || !customCommand.trim()}>
              Send
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Try commands like: fetch, dance, sleep, shake, etc.</p>
        </CardContent>
      </Card>

      {/* Command History */}
      {commandHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Recent Commands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {commandHistory.slice(-6).map((cmd, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {cmd}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
