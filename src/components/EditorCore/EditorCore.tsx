'use client'

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import EditorJS, { OutputData } from '@editorjs/editorjs'

interface EditorProps {
  data?: OutputData
  onChange?: (data: OutputData) => void
  className?: string
}

export interface EditorRefMethods {
  toggleBold: () => void
  toggleItalic: () => void
  toggleUnderline: () => void
  setHeading: (level: number) => void
}

const EditorCore = forwardRef<EditorRefMethods, EditorProps>(({ data, onChange, className }, ref) => {
  const editorRef = useRef<EditorJS | null>(null)

  useImperativeHandle(ref, () => ({
    toggleBold: () => {
      editorRef.current?.execute('bold');
    },
    toggleItalic: () => {
      editorRef.current?.execute('italic');
    },
    toggleUnderline: () => {
      editorRef.current?.execute('underline');
    },
    setHeading: (level: number) => {
      editorRef.current?.blocks.insert('header', { level });
    },
  }));

  useEffect(() => {
    let editor: EditorJS;

    const initEditor = async () => {
      const EditorJS = (await import('@editorjs/editorjs')).default
      const Header = (await import('@editorjs/header')).default
      const List = (await import('@editorjs/list')).default

      if (!editorRef.current) {
        editor = new EditorJS({
          holder: 'editorjs',
          data: data || {},
          onChange: async () => {
            const content = await editor.save()
            onChange && onChange(content)
          },
          autofocus: true,
          tools: {
            header: {
              class: Header,
              config: {
                placeholder: 'Enter a header',
                levels: [1, 2, 3, 4],
                defaultLevel: 3
              }
            },
            list: {
              class: List,
              inlineToolbar: true,
            }
          },
        })

        editorRef.current = editor
      }
    }

    initEditor()

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy()
      }
    }
  }, [])

  useEffect(() => {
    const editorElement = document.getElementById('editorjs');
    if (editorElement) {
      const focusEditor = () => {
        if (editorRef.current) {
          editorRef.current.focus();
        }
      };
      editorElement.addEventListener('click', focusEditor);
      return () => {
        editorElement.removeEventListener('click', focusEditor);
      };
    }
  }, []);

  return (
    <div 
      id="editorjs" 
      className={`prose max-w-none ${className || ''}`}
      contentEditable={true}
      suppressContentEditableWarning={true}
      style={{ cursor: 'text' }}
    />
  )
})

EditorCore.displayName = 'EditorCore'

export function EditorCoreInterface() {
  const [editorData, setEditorData] = React.useState({})
  const editorRef = React.useRef<EditorRefMethods>(null)

  const handleEditorChange = (data: any) => {
    setEditorData(data)
    console.log('Editor content changed:', data)
  }

  const handleHeadingChange = (value: string) => {
    const level = parseInt(value.replace('h', ''))
    if (!isNaN(level) && level >= 1 && level <= 4) {
      editorRef.current?.setHeading(level)
    }
  }

  const focusEditor = () => {
    if (editorRef.current) {
      const editorElement = document.getElementById('editorjs');
      if (editorElement) {
        editorElement.focus();
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="border-b">
        <div className="flex items-center px-4 py-2">
          <div className="flex items-center space-x-2 flex-1">
            <FileText className="h-6 w-6 text-blue-500" />
            <div className="flex-1">
              <h1 className="text-lg pl-1"
              contentEditable={true}
              suppressContentEditableWarning={true}
              >Untitled document</h1>
            </div>
          </div>
        </div>
        {/* Menu Items */}
        <div className="flex items-center space-x-2 px-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">File</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>New</DropdownMenuItem>
              <DropdownMenuItem>Open</DropdownMenuItem>
              <DropdownMenuItem>Save</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Export</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">Edit</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Undo</DropdownMenuItem>
              <DropdownMenuItem>Redo</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Cut</DropdownMenuItem>
              <DropdownMenuItem>Copy</DropdownMenuItem>
              <DropdownMenuItem>Paste</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">View</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Print layout</DropdownMenuItem>
              <DropdownMenuItem>Mode</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Show ruler</DropdownMenuItem>
              <DropdownMenuItem>Show outline</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">Insert</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Image</DropdownMenuItem>
              <DropdownMenuItem>Table</DropdownMenuItem>
              <DropdownMenuItem>Drawing</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Comment</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">Format</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Text</DropdownMenuItem>
              <DropdownMenuItem>Paragraph styles</DropdownMenuItem>
              <DropdownMenuItem>Align & indent</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Bullets & numbering</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">Tools</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Spelling & grammar</DropdownMenuItem>
              <DropdownMenuItem>Word count</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Preferences</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">Extensions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Add-ons</DropdownMenuItem>
              <DropdownMenuItem>Apps Script</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">Help</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Help</DropdownMenuItem>
              <DropdownMenuItem>Training</DropdownMenuItem>
              <DropdownMenuItem>Updates</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Send feedback</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">Accessibility</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Item 1</DropdownMenuItem>
              <DropdownMenuItem>Item 2</DropdownMenuItem>
              <DropdownMenuItem>Item 3</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Toolbar */}
        <div className="flex items-center space-x-1 px-4 py-1 border-t">
          <TooltipProvider>
            <div className="flex items-center space-x-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Search className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Search</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Undo2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Undo</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Redo2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Redo</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Printer className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Print</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
          <div className="h-4 w-px bg-border" />
          <Select defaultValue="100">
            <SelectTrigger className="w-[90px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="50">50%</SelectItem>
              <SelectItem value="75">75%</SelectItem>
              <SelectItem value="100">100%</SelectItem>
              <SelectItem value="125">125%</SelectItem>
              <SelectItem value="150">150%</SelectItem>
            </SelectContent>
          </Select>
          <div className="h-4 w-px bg-border" />
          <Select defaultValue="normal" onValueChange={handleHeadingChange}>
            <SelectTrigger className="w-[130px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal text</SelectItem>
              <SelectItem value="h1">Heading 1</SelectItem>
              <SelectItem value="h2">Heading 2</SelectItem>
              <SelectItem value="h3">Heading 3</SelectItem>
              <SelectItem value="h4">Heading 4</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="arial">
            <SelectTrigger className="w-[100px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="arial">Arial</SelectItem>
              <SelectItem value="times">Times New Roman</SelectItem>
              <SelectItem value="courier">Courier New</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center border rounded-md h-8">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none">
              <Minus className="h-3 w-3" />
            </Button>
            <Input 
              type="number" 
              className="w-12 h-8 border-0 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
              defaultValue="11" 
            />
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bold className="h-4 w-4"className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Underline className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Highlighter className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Link2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Image className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <div className="flex items-center">
                  <DropdownMenuItem>
                    
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <AlignLeft className="h-4 w-4" />
                        <ChevronDown className="h-3 w-3 -ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <div className="flex items-center">
                                
                        <DropdownMenuItem>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <AlignLeft className="h-4 w-4" />
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <AlignCenter className="h-4 w-4" />
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <AlignRight className="h-4 w-4" />
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <AlignJustify className="h-4 w-4" />
                            </Button>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
              
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Link2 className="h-4 w-4" />
                      </Button>
                  </DropdownMenuItem>
                
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex-1" />
          <div className="flex items-center space-x-0.5">
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Editing</DropdownMenuItem>
                <DropdownMenuItem>Suggesting</DropdownMenuItem>
                <DropdownMenuItem>Viewing</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {/* Document Area */}
        <div 
          className="w-full border border-gray-300 min-h-[500px] rounded-md overflow-hidden"
          onClick={focusEditor}
        >
          <EditorCore 
            ref={editorRef} 
            data={editorData} 
            onChange={handleEditorChange} 
            className="p-4 min-h-[500px] focus:outline-none" 
          />
        </div>
      </div>
    </div>
  )
}

export default EditorCoreInterface
