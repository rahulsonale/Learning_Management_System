import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { IconSparkle } from "@tabler/icons-react";

import { useState } from "react";

import Chat from "@/components/ui/course/chat";

export default function SheetSide() {
  const [messages, setMessages] = useState([]);

  function onNewMessage(message) {
    // Here you would typically send the message to your backend or AI service and get a response
    console.log("New message:", message);
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message, sender: "ai" },
    ]);
  }
  return (
    <div className="flex flex-wrap gap-2">
      <Sheet>
        <SheetTrigger
          render={
            <Button variant="outline" className="capitalize">
              Open Chat
              <IconSparkle />
            </Button>
          }
        />
        <SheetContent
          side="right"
          className="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]"
        >
          <SheetHeader>
            <SheetTitle>Ask AI</SheetTitle>
            <SheetDescription>
              Ask questions about the current lecture.
            </SheetDescription>
          </SheetHeader>
          <section className="no-scrollbar overflow-y-auto px-4">
            <ul className="flex flex-col gap-2">
              {messages.map((msg, index) => (
                <li
                  key={index}
                  className={`p-2 ${msg.sender === "user" ? "justify-end" : "justify-start"} flex`}
                >
                  <span
                    className={`font-semibold flex items-center justify-center rounded-lg py-2 px-4 flex-wrap ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
                  >
                    {msg.text}
                  </span>
                </li>
              ))}
            </ul>
          </section>
          <SheetFooter>
            <Chat onMessageSend={onNewMessage} />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
