import { Plus, FileText, MoreVertical } from "lucide-react"
import { Button } from "./button"
import { Tabs, TabsList, TabsTrigger } from "./tabs"
import { ArrowLeft } from "lucide-react"

export function DocumentTabs() {
    return (
        <div className="w-64 border-r p-4 flex flex-col h-[calc(100vh-120px)] overflow-hidden">
            <Button variant="ghost" size="icon" className="h-8 w-8 -ml-3 mb-2 -mt-3">
                <ArrowLeft className="h-12 w-12" />
            </Button>
            <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-medium">Document tabs</h2>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <Tabs defaultValue="tab1" className="w-full">
                <TabsList className="w-full justify-start">
                    <TabsTrigger value="tab1" className="w-full flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        <div
                            contentEditable={true}
                            className="w-full text-left outline-none"
                            suppressContentEditableWarning={true}
                        >
                            Tab 1
                        </div>
                        <Button variant="ghost" size="icon" className="h-5 w-5 ml-auto">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </TabsTrigger>
                </TabsList>
            </Tabs>
            </div>
            <DocumentTabs />
        </div>
    )
}