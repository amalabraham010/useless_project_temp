"use client"

import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Pablo3D from "./components/pablo-3d"

export default function PabloPet() {
  const [command, setCommand] = useState("")
  const [response, setResponse] = useState(
    "*Pablo wags tail and looks at you with mischievous eyes* Woof! I'm Pablo! Try telling me what to do... hehe 😈",
  )
  const [mood, setMood] = useState("mischievous")
  const [isGoodDog, setIsGoodDog] = useState(false)
  const [goodDogTimer, setGoodDogTimer] = useState(0)
  const [energy, setEnergy] = useState(100)
  const [currentAnimation, setCurrentAnimation] = useState("idle")

  // Good dog timer countdown
  useEffect(() => {
    if (isGoodDog && goodDogTimer > 0) {
      const timer = setTimeout(() => {
        setGoodDogTimer(goodDogTimer - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (isGoodDog && goodDogTimer === 0) {
      setIsGoodDog(false)
      setMood("mischievous")
      setCurrentAnimation("spin")
      setResponse(
        "*Pablo shakes off the good behavior* Hehe, that's enough being good! Back to my usual self! 😈 *runs around in circles*",
      )
      setTimeout(() => setCurrentAnimation("idle"), 3000)
    }
  }, [isGoodDog, goodDogTimer])

  const disobedientResponses = {
    sit: {
      responses: [
        "*stands up even taller* Woof? Nah... I think I'll stand, thanks! 🐕",
        "*lies down instead* Oops! Wrong command! Hehe 😜",
        "*starts spinning in circles* Sit? How about SPIN! Wheee! 🌪️",
      ],
      animation: "jump",
    },
    stay: {
      responses: [
        "*immediately runs to the other side* Catch me if you can! 🏃‍♂️💨",
        "*takes one step forward* Oops! My paw slipped! Hehe 😏",
        "*starts chasing own tail* Stay? But my tail is moving! Must catch it! 🌀",
      ],
      animation: "run",
    },
    come: {
      responses: [
        "*runs in the opposite direction* Nope! You come to ME! 😤",
        "*hides behind imaginary furniture* Can't see me, can't command me! 🙈",
        "*sits down stubbornly* My paws are suddenly very heavy... can't move! 😴",
      ],
      animation: "hide",
    },
    "roll over": {
      responses: [
        "*does a little hop instead* How about a jump? Close enough! 🦘",
        "*rolls the wrong way* Oops! I only know how to roll left! 🙃",
        "*lies on back but doesn't roll* This is as far as I go! Deal with it! 😎",
      ],
      animation: "spin",
    },
    speak: {
      responses: [
        "*whispers* woof... 🤫",
        "*makes weird noises* Meow! Wait... that's not right... HONK! 🦆",
        "*barks defiantly* WOOF WOOF! But only because I WANTED to! 😤",
      ],
      animation: "speak",
    },
    fetch: {
      responses: [
        "*looks at you like you're crazy* You throw it, YOU fetch it! I'm not your servant! 🙄",
        "*pretends to fetch but brings back nothing* Here's your... air! Enjoy! 😂",
        "*buries imaginary toy* Oops! Can't fetch what's buried! Hehe 😈",
      ],
      animation: "run",
    },
    "good dog": {
      responses: [
        "*rolls eyes* Ugh, I know I'm good! Tell me something I don't know! 💅",
        "*wags tail sarcastically* Oh WOW, such praise! 🙄✨",
        "*does a little bow mockingly* Why thank you, human servant! 👑",
      ],
      animation: "jump",
    },
  }

  const obedientResponses = {
    sit: {
      response: "*sits down politely* Woof! There you go! 🐕✨",
      animation: "sit",
    },
    stay: {
      response: "*stays perfectly still* I'm being such a good boy! 😇",
      animation: "idle",
    },
    come: {
      response: "*trots over happily* Here I am! 🏃‍♂️💕",
      animation: "run",
    },
    "roll over": {
      response: "*does a perfect roll* Ta-da! How was that? 🌟",
      animation: "spin",
    },
    speak: {
      response: "*barks clearly* WOOF WOOF! 🗣️",
      animation: "speak",
    },
    fetch: {
      response: "*pretends to fetch enthusiastically* Got it! Here you go! 🎾",
      animation: "run",
    },
    "good dog": {
      response: "*wags tail happily* Thank you! I'm trying my best! 😊",
      animation: "jump",
    },
  }

  const getRandomResponse = (responses: string[]) => {
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleCommand = () => {
    if (!command.trim()) return

    const lowerCommand = command.toLowerCase().trim()

    // Check for the magic phrase
    if (lowerCommand === "okay, be a good dog now" || lowerCommand === "okay be a good dog now") {
      setIsGoodDog(true)
      setGoodDogTimer(30) // 30 seconds of being good
      setMood("obedient")
      setCurrentAnimation("jump")
      setResponse("*ears perk up and tail wags* Okay okay! I'll be good... for now! 😇 *sits nicely*")
      setCommand("")
      setTimeout(() => setCurrentAnimation("sit"), 2000)
      return
    }

    // Find matching command
    let foundCommand = ""
    for (const cmd of Object.keys(disobedientResponses)) {
      if (lowerCommand.includes(cmd)) {
        foundCommand = cmd
        break
      }
    }

    if (foundCommand) {
      if (isGoodDog) {
        const obedientCmd = obedientResponses[foundCommand as keyof typeof obedientResponses]
        setResponse(obedientCmd.response)
        setCurrentAnimation(obedientCmd.animation)
        setMood("obedient")
      } else {
        const disobedientCmd = disobedientResponses[foundCommand as keyof typeof disobedientResponses]
        setResponse(getRandomResponse(disobedientCmd.responses))
        setCurrentAnimation(disobedientCmd.animation)
        setMood("defiant")
        setEnergy(Math.max(0, energy - 10))
      }
    } else {
      // Generic disobedient responses for unknown commands
      const genericResponses = [
        "*tilts head confused* Woof? I don't speak human very well... 🤔",
        "*ignores you completely* La la la, can't hear you! 🙉",
        "*does something completely random* How about I chase my tail instead? 🌀",
        "*barks defiantly* NO! Whatever you said, the answer is NO! 😤",
        "*pretends to sleep* Zzz... sorry, nap time! 😴",
        "*runs around excitedly* I'm too busy being AWESOME! 🌟",
      ]

      if (isGoodDog) {
        setResponse("*looks confused but tries to please* I'm not sure what that means, but I'm trying to be good! 😅")
        setCurrentAnimation("idle")
      } else {
        setResponse(getRandomResponse(genericResponses))
        setCurrentAnimation("spin")
        setMood("playful")
      }
    }

    // Reset animation after a few seconds
    setTimeout(() => {
      if (currentAnimation !== "sit") {
        setCurrentAnimation("idle")
      }
    }, 3000)

    setCommand("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-brown-800">🐕 Pablo the Mischievous Dog 🐕</CardTitle>
            <div className="flex justify-center gap-2 mt-2">
              <Badge variant={isGoodDog ? "default" : "destructive"}>
                {isGoodDog ? `Good Dog Mode (${goodDogTimer}s)` : "Mischief Mode"}
              </Badge>
              <Badge variant="outline">
                Mood: {mood} {isGoodDog ? "😇" : mood === "defiant" ? "😤" : mood === "playful" ? "😜" : "😈"}
              </Badge>
              <Badge variant="secondary">Energy: {energy}%</Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 3D Pablo */}
          <Card className="h-96">
            <CardContent className="p-0 h-full">
              <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <Pablo3D mood={mood} isGoodDog={isGoodDog} currentAnimation={currentAnimation} />
                <OrbitControls enablePan={false} enableZoom={false} maxPolarAngle={Math.PI / 2} />
                <Environment preset="park" />
              </Canvas>
            </CardContent>
          </Card>

          {/* Controls and Response */}
          <div className="space-y-6">
            {/* Pablo's Response */}
            <Card>
              <CardContent className="p-6">
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                  <p className="text-lg font-medium text-blue-800">Pablo says:</p>
                  <p className="text-blue-700 mt-2">{response}</p>
                </div>
              </CardContent>
            </Card>

            {/* Command Input */}
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-2">
                  <Input
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    placeholder="Give Pablo a command... (sit, stay, come, roll over, speak, fetch)"
                    onKeyPress={(e) => e.key === "Enter" && handleCommand()}
                    className="flex-1"
                  />
                  <Button onClick={handleCommand} className="px-6">
                    Command Pablo!
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  💡 Tip: Try saying "Okay, be a good dog now" to make Pablo temporarily obedient!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <h3 className="font-bold mb-2">How to play with Pablo:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Try commands like: sit, stay, come, roll over, speak, fetch</li>
              <li>• Pablo will usually disobey and be cheeky about it!</li>
              <li>• Watch him move and animate in 3D based on his responses</li>
              <li>• Say "Okay, be a good dog now" to make him temporarily obedient</li>
              <li>• Use your mouse to rotate the camera around Pablo</li>
              <li>• Watch his mood change his color and behavior</li>
              <li>• Enjoy Pablo's sassy personality! 🐕😈</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
