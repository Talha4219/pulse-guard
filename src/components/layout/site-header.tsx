"use client"

import { Bell, Search, Smartphone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { PatientSimulator } from "@/components/pulseguard/patient-simulator"

export function SiteHeader() {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background/50 backdrop-blur-md sticky top-0 z-10">
            <SidebarTrigger className="-ml-1" />
            <div className="flex flex-1 items-center gap-4">
                <div className="relative w-full max-w-sm ml-4 hidden md:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search patients, records..."
                        className="w-full bg-background pl-8 md:w-[300px] lg:w-[300px] h-9"
                    />
                </div>
                <div className="ml-auto flex items-center gap-2">
                    {/* Device Simulator Trigger */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="hidden md:flex gap-2">
                                <Smartphone className="h-4 w-4" />
                                Device Simulator
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                            <SheetHeader>
                                <SheetTitle>Patient Device Simulation</SheetTitle>
                                <SheetDescription>
                                    Use these controls to mimic signals sent from the patient's ESP32 device.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="mt-6">
                                <PatientSimulator />
                            </div>
                        </SheetContent>
                    </Sheet>

                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    </Button>
                </div>
            </div>
        </header>
    )
}
