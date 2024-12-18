import React, { useState, useRef, useEffect } from 'react';
import { FolderOpen, Folder, File, ChevronRight, ChevronDown, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "~/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { cn } from "~/lib/utils";
import { collapse } from 'slate';

const initialFolders = {
  id: 'root',
  name: 'Root',
  type: 'folder',
  children: [
    {
      id: '1',
      name: 'Company Context',
      type: 'folder',
      children: [
        { id: '3', name: 'Quote 1', type: 'file' },
        { id: '4', name: 'Quote 2', type: 'file' }
      ]
    },
    {
      id: '2',
      name: 'Salesperson Context',
      type: 'folder',
      children: [
        {
          id: '6',
          name: 'Client 2',
          type: 'folder',
          children: []
        }
      ]
    },
    {
      id: '7',
      name: 'Product Context',
      type: 'folder',
      children: [
        {
          id: '8',
          name: 'Client 2',
          type: 'folder',
          children: []
        }
      ]
    },
    {
      id: '9',
      name: 'Deal Context',
      type: 'folder',
      children: []
    },
    {
      id: '10',
      name: 'Customer Context',
      type: 'folder',
      children: []
    }
  ]
};

const FolderTree = () => {
  const [folders, setFolders] = useState(initialFolders);
  const [expandedFolders, setExpandedFolders] = useState(new Set(['root']));
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [dropPosition, setDropPosition] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    }
  }, [editingId]);

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const handleDragStart = (e, item) => {
    if (editingId) return;
    setDraggedItem(item);
    e.dataTransfer.setData('text/plain', '');
  };

  const handleDragOver = (e, item) => {
    e.preventDefault();
    if (!draggedItem || item.id === draggedItem.id) return;

    // Check if target is a child of dragged item
    const isChild = (parent, targetId) => {
      if (!parent.children) return false;
      return parent.children.some(child => 
        child.id === targetId || isChild(child, targetId)
      );
    };

    // Prevent drop if target is a child of dragged item
    if (isChild(draggedItem, item.id)) {
      setDropTarget(null);
      setDropPosition(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const thirdHeight = rect.height / 3;

    // Special handling for root folder
    if (item.id === 'root') {
      if (mouseY > thirdHeight * 2) {
        setDropPosition('after');
      } else {
        setDropPosition('inside');
      }
    } else {
      // Normal handling for other items
      if (mouseY < thirdHeight) {
        setDropPosition('before');
      } else if (mouseY > thirdHeight * 2) {
        setDropPosition('after');
      } else {
        setDropPosition(item.type === 'folder' ? 'inside' : 'after');
      }
    }

    setDropTarget(item.id);
  };

  const handleDrop = (e, targetItem) => {
    e.preventDefault();
    if (!draggedItem || targetItem.id === draggedItem.id) {
      resetDragState();
      return;
    }

    // Check if target is a child of dragged item
    const isChild = (parent, targetId) => {
      if (!parent.children) return false;
      return parent.children.some(child => 
        child.id === targetId || isChild(child, targetId)
      );
    };

    // Prevent drop if target is a child of dragged item
    if (isChild(draggedItem, targetItem.id)) {
      resetDragState();
      return;
    }

    setFolders(prev => {
      const processTree = (tree, mode = 'remove', itemToAdd = null, targetId = null) => {
        // Handle root drops
        if (mode === 'add' && tree.id === 'root' && targetId === 'root' && dropPosition === 'inside') {
          return {
            ...tree,
            children: [...(tree.children || []), itemToAdd]
          };
        }

        // Handle direct match
        if (mode === 'add' && tree.id === targetId) {
          if (dropPosition === 'inside' && tree.type === 'folder') {
            return {
              ...tree,
              children: [...(tree.children || []), itemToAdd]
            };
          }
          return tree;
        }

        // No children case
        if (!tree.children) {
          return tree;
        }

        // Process children
        let newChildren = [...tree.children];

        if (mode === 'remove') {
          // Remove dragged item from its original position
          newChildren = newChildren.filter(child => child.id !== draggedItem.id);
        } else if (mode === 'add') {
          // Find the target and add the item in the correct position
          const targetIndex = newChildren.findIndex(child => child.id === targetId);
          if (targetIndex !== -1) {
            if (dropPosition === 'before') {
              newChildren.splice(targetIndex, 0, itemToAdd);
            } else if (dropPosition === 'after') {
              newChildren.splice(targetIndex + 1, 0, itemToAdd);
            }
          }
        }

        // Process children recursively
        newChildren = newChildren.map(child => processTree(child, mode, itemToAdd, targetId));

        return {
          ...tree,
          children: newChildren.length > 0 ? newChildren : undefined
        };
      };

      // First, find and remove the dragged item
      let newTree = processTree(prev, 'remove');
      
      // Then, add it in its new position
      newTree = processTree(newTree, 'add', draggedItem, targetItem.id);

      return newTree;
    });

    resetDragState();
  };

  const resetDragState = () => {
    setDraggedItem(null);
    setDropTarget(null);
    setDropPosition(null);
  };

  const handleDragEnd = () => {
    resetDragState();
  };

  const startEditing = (item, e) => {
    e.stopPropagation();
    setEditingId(item.id);
    setEditingValue(item.name);
  };

  const handleBlur = (e) => {
    // Only finish editing if we're not clicking inside the same input
    const relatedTarget = e.relatedTarget;
    if (!relatedTarget || !inputRef.current?.contains(relatedTarget)) {
      finishEditing();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      finishEditing();
    }
    if (e.key === 'Escape') {
      setEditingValue(item.name);
      setEditingId(null);
    }
  };

  const finishEditing = () => {
    if (!editingId) return;

    const updateItemName = (tree, itemId, newName) => {
      if (tree.id === itemId) {
        return { ...tree, name: newName };
      }

      if (tree.children) {
        return {
          ...tree,
          children: tree.children.map(child => updateItemName(child, itemId, newName))
        };
      }

      return tree;
    };

    setFolders(prev => updateItemName(prev, editingId, editingValue.trim() || 'Untitled'));
    setEditingId(null);
  };

  const handleDelete = () => {
    if (!itemToDelete) return;
    
    setFolders(prev => {
      const deleteFromTree = (tree) => {
        if (!tree.children) return tree;
        
        return {
          ...tree,
          children: tree.children
            .filter(child => child.id !== itemToDelete.id)
            .map(child => deleteFromTree(child))
        };
      };
      
      return deleteFromTree(prev);
    });
    
    setItemToDelete(null);
    setDeleteConfirmOpen(false);
    setSelectedItem(null);
  };

  const renderItem = (item, depth = 0) => {
    const isExpanded = expandedFolders.has(item.id);
    const isFolder = item.type === 'folder';
    const isDragging = draggedItem?.id === item.id;
    const isDropTarget = dropTarget === item.id;
    const isEditing = editingId === item.id;

    return (
      <div key={item.id} className="select-none">
        <div
          className={cn(
            "relative flex items-center gap-2 rounded-md px-1.5 h-7 text-sm outline-none transition-colors peer",
            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isDragging && "opacity-50",
            isDropTarget && "bg-sidebar-accent/10",
            selectedItem === item.id && "bg-sidebar-accent text-sidebar-accent-foreground"
          )}
          style={{ paddingLeft: `${depth * 20}px` }}
          draggable={!isEditing}
          onDragStart={(e) => handleDragStart(e, item)}
          onDragOver={(e) => handleDragOver(e, item)}
          onDrop={(e) => handleDrop(e, item)}
          onDragEnd={handleDragEnd}
          onClick={(e) => {
            if (!isEditing) {
              e.stopPropagation();
              setSelectedItem(item.id);
              if (isFolder) toggleFolder(item.id);
            }
          }}
        >
          {/* Drop position indicators */}
          {isDropTarget && dropPosition === 'before' && item.id !== 'root' && (
            <div className="absolute -top-[2px] left-0 right-0 h-[2px] bg-sidebar-accent" />
          )}
          {isDropTarget && dropPosition === 'after' && (
            <div className="absolute -bottom-[2px] left-0 right-0 h-[2px] bg-sidebar-accent" />
          )}
          {isDropTarget && dropPosition === 'inside' && (
            <div className="absolute inset-0 ring-2 ring-sidebar-accent rounded-md pointer-events-none" />
          )}

          {isFolder && (
            <button
              className="flex items-center justify-center rounded hover:bg-sidebar-accent/50"
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(item.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )}
            </button>
          )}
          {isFolder ? (
            isExpanded ? (
              <FolderOpen className="size-4 shrink-0" />
            ) : (
              <Folder className="size-4 shrink-0" />
            )
          ) : (
            <File className="size-4 shrink-0" />
          )}
          {isEditing ? (
            <div className="flex-1 flex items-center">
              <input
                ref={inputRef}
                type="text"
                className="w-full bg-transparent outline-none"
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={(e) => {
                  // Only finish editing if we're not clicking inside the dropdown
                  if (!e.relatedTarget?.closest('[role="menu"]')) {
                    finishEditing();
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          ) : (
            <span 
              className="truncate flex-1"
              onDoubleClick={(e) => startEditing(item, e)}
            >
              {item.name}
            </span>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="ml-auto h-6 w-6 shrink-0 p-0 hover:bg-sidebar-accent/50 opacity-0 hover:opacity-100 peer-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-40"
              align="end"
              side="right"
              sideOffset={4}
              onCloseAutoFocus={(e) => {
                e.preventDefault();
                if (editingId === item.id && inputRef.current) {
                  inputRef.current.focus();
                }
              }}
            >
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingId(item.id);
                  setEditingValue(item.name);
                }}
              >
                <Pencil className="mr-2 size-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => {
                  setItemToDelete(item);
                  setDeleteConfirmOpen(true);
                }}
              >
                <Trash2 className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {isFolder && isExpanded && item.children?.map(child =>
          renderItem(child, depth + 1)
        )}
      </div>
    );
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-1 p-1" onClick={() => setSelectedItem(null)}>
      {folders.children.map((item) => renderItem(item))}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to delete this item?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FolderTree;