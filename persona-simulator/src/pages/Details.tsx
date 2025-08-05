import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Building, Plus, Download, Upload, Save, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface CellData {
  [key: string]: string
}

interface SpreadsheetData {
  [rowIndex: number]: CellData
}

const initialColumns = [
  'Company',
  'Website',
  'Category',
  'Revenue',
  'Employees',
  'Location',
  'Founded',
  'Description'
]

const initialData: SpreadsheetData = {
  0: { Company: 'Tesla', Website: 'tesla.com', Category: 'Automotive', Revenue: '$96.8B', Employees: '140,000', Location: 'Austin, TX', Founded: '2003', Description: 'Electric vehicles and clean energy' },
  1: { Company: 'Meta', Website: 'meta.com', Category: 'Social Media', Revenue: '$117.9B', Employees: '86,482', Location: 'Menlo Park, CA', Founded: '2004', Description: 'Social networking and metaverse' },
  2: { Company: 'NVIDIA', Website: 'nvidia.com', Category: 'Semiconductors', Revenue: '$79.8B', Employees: '29,600', Location: 'Santa Clara, CA', Founded: '1993', Description: 'Graphics processing and AI chips' },
  3: { Company: 'Apple', Website: 'apple.com', Category: 'Technology', Revenue: '$394.3B', Employees: '164,000', Location: 'Cupertino, CA', Founded: '1976', Description: 'Consumer electronics and software' },
  4: { Company: 'Microsoft', Website: 'microsoft.com', Category: 'Software', Revenue: '$211.9B', Employees: '221,000', Location: 'Redmond, WA', Founded: '1975', Description: 'Software and cloud services' }
}

export function Details() {
  const [data, setData] = useState<SpreadsheetData>(initialData)
  const [columns, setColumns] = useState<string[]>(initialColumns)
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: string } | null>(null)
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null)
  const [editValue, setEditValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const rows = Math.max(20, Object.keys(data).length + 5) // Minimum 20 rows

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingCell])

  const handleCellClick = (row: number, col: string) => {
    if (editingCell) {
      handleCellSave()
    }
    setSelectedCell({ row, col })
  }

  const handleCellDoubleClick = (row: number, col: string) => {
    const currentValue = data[row]?.[col] || ''
    setEditingCell({ row, col })
    setEditValue(currentValue)
  }

  const handleCellSave = () => {
    if (editingCell) {
      setData(prev => ({
        ...prev,
        [editingCell.row]: {
          ...prev[editingCell.row],
          [editingCell.col]: editValue
        }
      }))
      setEditingCell(null)
      setEditValue('')
      toast.success('Cell updated!')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCellSave()
    } else if (e.key === 'Escape') {
      setEditingCell(null)
      setEditValue('')
    }
  }

  const addRow = () => {
    const newRowIndex = Math.max(...Object.keys(data).map(Number), -1) + 1
    setData(prev => ({
      ...prev,
      [newRowIndex]: {}
    }))
    toast.success('Row added!')
  }

  const addColumn = () => {
    const newColumnName = `Column ${columns.length + 1}`
    setColumns(prev => [...prev, newColumnName])
    toast.success('Column added!')
  }

  const deleteRow = (rowIndex: number) => {
    setData(prev => {
      const newData = { ...prev }
      delete newData[rowIndex]
      return newData
    })
    toast.success('Row deleted!')
  }

  const exportData = () => {
    const csvContent = [
      columns.join(','),
      ...Object.entries(data).map(([_, rowData]) => 
        columns.map(col => `"${rowData[col] || ''}"`).join(',')
      )
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'spreadsheet-data.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Data exported!')
  }

  const saveData = () => {
    localStorage.setItem('spreadsheet-data', JSON.stringify({ data, columns }))
    toast.success('Data saved!')
  }

  return (
    <main className="px-6 py-8">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
              <Building className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-semibold">Excel-like Spreadsheet</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={addRow}>
              <Plus className="w-4 h-4 mr-1" />
              Row
            </Button>
            <Button variant="outline" size="sm" onClick={addColumn}>
              <Plus className="w-4 h-4 mr-1" />
              Column
            </Button>
            <Button variant="outline" size="sm" onClick={saveData}>
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={exportData}>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        {/* Spreadsheet */}
        <Card className="overflow-hidden">
          <div className="overflow-auto max-h-[70vh]">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800 z-10">
                <tr>
                  <th className="w-12 p-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300">
                    #
                  </th>
                  {columns.map((col, colIndex) => (
                    <th key={col} className="min-w-[120px] p-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{col}</span>
                        {colIndex >= 8 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                            onClick={() => {
                              setColumns(prev => prev.filter((_, i) => i !== colIndex))
                              toast.success('Column deleted!')
                            }}
                          >
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: rows }, (_, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{rowIndex + 1}</span>
                        {data[rowIndex] && Object.keys(data[rowIndex]).length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                            onClick={() => deleteRow(rowIndex)}
                          >
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </td>
                    {columns.map((col) => {
                      const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === col
                      const isEditing = editingCell?.row === rowIndex && editingCell?.col === col
                      const cellValue = data[rowIndex]?.[col] || ''

                      return (
                        <td
                          key={`${rowIndex}-${col}`}
                          className={`p-0 border border-gray-300 dark:border-gray-600 cursor-cell ${
                            isSelected ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                          onClick={() => handleCellClick(rowIndex, col)}
                          onDoubleClick={() => handleCellDoubleClick(rowIndex, col)}
                        >
                          {isEditing ? (
                            <Input
                              ref={inputRef}
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={handleCellSave}
                              onKeyDown={handleKeyDown}
                              className="border-0 rounded-none h-8 text-sm focus:ring-0 focus:border-0"
                            />
                          ) : (
                            <div className="p-2 min-h-[32px] text-sm">
                              {cellValue}
                            </div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Instructions */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          <p><strong>Instructions:</strong> Click to select a cell, double-click to edit. Press Enter to save, Escape to cancel. Use the buttons above to add rows/columns or export data.</p>
        </div>
      </div>
    </main>
  )
}