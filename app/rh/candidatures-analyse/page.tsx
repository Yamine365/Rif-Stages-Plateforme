'use client'

import { useState } from 'react'
import { mockCandidatures, mockStagiaires } from '@/lib/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { CVAnalysisModal } from '@/components/cv-analysis-modal'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Search,
  TrendingUp,
  FileText,
  Eye,
  AlertCircle,
  CheckCircle2,
  BarChart3,
} from 'lucide-react'

export default function CandidaturesInternPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null)
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false)

  // Filter candidatures with analysis
  const candidaturesWithAnalysis = mockCandidatures.filter(c => c.analyseCV)

  const filteredCandidatures = candidaturesWithAnalysis
    .filter(c => {
      if (!searchTerm) return true
      const searchLower = searchTerm.toLowerCase()
      const stagiaire = mockStagiaires.find(s => s.id === c.stagiaireId)
      return (
        stagiaire?.nom.toLowerCase().includes(searchLower) ||
        stagiaire?.prenom.toLowerCase().includes(searchLower) ||
        stagiaire?.email.toLowerCase().includes(searchLower) ||
        c.formation?.specialite.toLowerCase().includes(searchLower)
      )
    })
    .sort((a, b) => (b.analyseCV?.score || 0) - (a.analyseCV?.score || 0))

  // Statistics
  const stats = {
    total: candidaturesWithAnalysis.length,
    excellent: candidaturesWithAnalysis.filter(c => (c.analyseCV?.score || 0) >= 80).length,
    bon: candidaturesWithAnalysis.filter(c => {
      const score = c.analyseCV?.score || 0
      return score >= 60 && score < 80
    }).length,
    moyen: candidaturesWithAnalysis.filter(c => (c.analyseCV?.score || 0) < 60).length,
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50'
    if (score >= 60) return 'text-amber-600 bg-amber-50'
    return 'text-red-600 bg-red-50'
  }

  const getScoreBadgeVariant = (score: number): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (score >= 80) return 'default'
    if (score >= 60) return 'secondary'
    return 'destructive'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analyse des candidatures</h1>
        <p className="mt-1 text-muted-foreground">
          Examinez les CV avec scores d'analyse automatique
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.excellent}</p>
                <p className="text-sm text-muted-foreground">Excellent (≥80)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <TrendingUp className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.bon}</p>
                <p className="text-sm text-muted-foreground">Bon (60-79)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.moyen}</p>
                <p className="text-sm text-muted-foreground">Moyen ({'<'}60)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Tableau des candidatures
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Chercher par nom, email ou formation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidat</TableHead>
                  <TableHead>Formation</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead>Compétences</TableHead>
                  <TableHead>Expérience</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidatures.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Aucune candidature trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCandidatures.map((candidature) => {
                    const stagiaire = mockStagiaires.find(s => s.id === candidature.stagiaireId)
                    const analysis = candidature.analyseCV
                    if (!stagiaire || !analysis) return null

                    return (
                      <TableRow key={candidature.id}>
                        <TableCell>
                          <div className="font-medium">{stagiaire.prenom} {stagiaire.nom}</div>
                          <div className="text-sm text-muted-foreground">{stagiaire.email}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{candidature.formation?.specialite}</div>
                            <div className="text-muted-foreground text-xs">{analysis.formation}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <div className={`p-2 rounded-lg text-center font-bold ${getScoreColor(analysis.score)}`}>
                              <div className="text-lg">{analysis.score}</div>
                              <div className="text-xs">/ 100</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap max-w-xs">
                            {analysis.competences.slice(0, 2).map((comp, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {comp}
                              </Badge>
                            ))}
                            {analysis.competences.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{analysis.competences.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {analysis.experience}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedAnalysis(candidature.id)
                              setIsAnalysisOpen(true)
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Legend */}
          <div className="flex gap-4 text-sm text-muted-foreground pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-600" />
              <span>Excellent: ≥80</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-amber-600" />
              <span>Bon: 60-79</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-600" />
              <span>Moyen: {'<'}60</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CV Analysis Modal */}
      {selectedAnalysis && (
        <CVAnalysisModal
          candidatureId={selectedAnalysis}
          isOpen={isAnalysisOpen}
          onOpenChange={setIsAnalysisOpen}
        />
      )}
    </div>
  )
}
