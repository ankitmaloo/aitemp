import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Upload, FileText, Database } from 'lucide-react'

export function ListCreator() {
  const [textInput, setTextInput] = useState('')
  const [instructions, setInstructions] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const validFiles = files.filter(file => {
      const validTypes = ['text/plain', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
      return validTypes.includes(file.type) || file.name.endsWith('.txt') || file.name.endsWith('.csv')
    })
    setUploadedFiles(prev => [...prev, ...validFiles])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    // TODO: Process the data and navigate to excel-like page
    console.log('Text input:', textInput)
    console.log('Instructions:', instructions)
    console.log('Files:', uploadedFiles)
    alert('List creation functionality will be implemented next!')
  }

  return (
    <main className="px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            Create New List
          </h1>
          <p className="text-lg" style={{ color: 'hsl(215, 16%, 47%)' }}>
            Upload files, paste links, or enter text to create your data list
          </p>
        </div>

        <div className="space-y-6">
          {/* File Upload Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Upload Files
            </h2>
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-6 text-center" style={{ borderColor: 'var(--border)' }}>
                <input
                  type="file"
                  multiple
                  accept=".txt,.csv,.xls,.xlsx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center space-y-2">
                    <FileText className="w-8 h-8" style={{ color: 'hsl(215, 16%, 47%)' }} />
                    <p style={{ color: 'var(--foreground)' }}>
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm" style={{ color: 'hsl(215, 16%, 47%)' }}>
                      Supports: TXT, CSV, Excel files
                    </p>
                  </div>
                </label>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium">Uploaded Files:</h3>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: 'var(--muted)' }}>
                      <span className="text-sm">{file.name}</span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Text Input Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Raw Text Input
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Enter your data (links, CSV, or any text - one item per line):
                </label>
                <Textarea
                  placeholder="Paste your links, CSV data, or text here...&#10;Each line will be treated as a separate item&#10;&#10;Example:&#10;https://example.com&#10;Item 1, Value 1, Category A&#10;Item 2, Value 2, Category B"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
            </div>
          </Card>

          {/* Instructions Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Processing Instructions
            </h2>
            <div>
              <label className="block text-sm font-medium mb-2">
                Instructions for how to process your data:
              </label>
              <Textarea
                placeholder="Enter specific instructions for how you want your data processed...&#10;&#10;Example:&#10;- Split CSV by commas&#10;- Extract domain names from URLs&#10;- Group items by category&#10;- Remove duplicates"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              variant="default"
              onClick={handleSubmit}
              size="lg"
              className="px-8"
              disabled={!textInput.trim() && uploadedFiles.length === 0}
            >
              Create List
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}