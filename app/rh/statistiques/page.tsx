'use client'

import { mockCandidatures, mockStagiaires, mockConventions, mockEvaluations, mockTuteurs } from '@/lib/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Star,
  Calendar,
} from 'lucide-react'

export default function StatistiquesPage() {
  // Calculate stats
  const totalCandidatures = mockCandidatures.filter(c => c.status !== 'brouillon').length
  const candidaturesAcceptees = mockCandidatures.filter(c => c.status === 'acceptee').length
  const candidaturesRefusees = mockCandidatures.filter(c => c.status === 'refusee').length
  const candidaturesEnAttente = mockCandidatures.filter(c => c.status === 'soumise').length
  
  const tauxAcceptation = totalCandidatures > 0 
    ? Math.round((candidaturesAcceptees / totalCandidatures) * 100) 
    : 0
  const tauxRefus = totalCandidatures > 0 
    ? Math.round((candidaturesRefusees / totalCandidatures) * 100) 
    : 0

  // Department stats
  const departementStats = mockCandidatures
    .filter(c => c.preferencesStage?.departementSouhaite)
    .reduce((acc, c) => {
      const dept = c.preferencesStage!.departementSouhaite
      acc[dept] = (acc[dept] || 0) + 1
      return acc
    }, {} as Record<string, number>)

  const sortedDepartements = Object.entries(departementStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const maxDeptCount = sortedDepartements[0]?.[1] || 1

  // Evaluation average
  const avgEvaluation = mockEvaluations.length > 0
    ? mockEvaluations.reduce((sum, e) => 
        sum + (e.competencesTechniques + e.autonomie + e.integrationEquipe) / 3, 0
      ) / mockEvaluations.length
    : 0

  // Convention stats
  const conventionsSigned = mockConventions.filter(c => c.status === 'signee_complete').length
  const conventionsPending = mockConventions.filter(c => c.status !== 'signee_complete').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Statistiques</h1>
        <p className="mt-1 text-muted-foreground">
          Vue d'ensemble des métriques de la plateforme
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total candidatures
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCandidatures}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {candidaturesEnAttente} en attente de traitement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taux d'acceptation
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{tauxAcceptation}%</div>
            <Progress value={tauxAcceptation} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Stagiaires actifs
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {mockStagiaires.filter(s => s.tuteurId).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              sur {mockStagiaires.length} inscrits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Note moyenne
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {avgEvaluation.toFixed(1)}/5
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              basée sur {mockEvaluations.length} évaluation(s)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Candidatures breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Répartition des candidatures</CardTitle>
            <CardDescription>
              Statut des {totalCandidatures} candidatures
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Acceptées</span>
                  <span className="text-sm text-muted-foreground">
                    {candidaturesAcceptees} ({tauxAcceptation}%)
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${tauxAcceptation}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">En attente</span>
                  <span className="text-sm text-muted-foreground">
                    {candidaturesEnAttente} ({totalCandidatures > 0 ? Math.round((candidaturesEnAttente / totalCandidatures) * 100) : 0}%)
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500 rounded-full"
                    style={{ width: `${totalCandidatures > 0 ? (candidaturesEnAttente / totalCandidatures) * 100 : 0}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Refusées</span>
                  <span className="text-sm text-muted-foreground">
                    {candidaturesRefusees} ({tauxRefus}%)
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${tauxRefus}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top departments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Départements les plus demandés</CardTitle>
            <CardDescription>
              Répartition par département souhaité
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedDepartements.map(([dept, count]) => (
                <div key={dept}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{dept}</span>
                    <span className="text-sm text-muted-foreground">
                      {count} candidature(s)
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(count / maxDeptCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              {sortedDepartements.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucune donnée disponible
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional stats */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Conventions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total générées</span>
                <span className="font-semibold">{mockConventions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Entièrement signées</span>
                <span className="font-semibold text-green-600">{conventionsSigned}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">En attente</span>
                <span className="font-semibold text-yellow-600">{conventionsPending}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              Tuteurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total tuteurs</span>
                <span className="font-semibold">{mockTuteurs.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Avec stagiaires</span>
                <span className="font-semibold text-primary">
                  {mockTuteurs.filter(t => t.stagiairesIds.length > 0).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Disponibles</span>
                <span className="font-semibold">
                  {mockTuteurs.filter(t => t.stagiairesIds.length === 0).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-4 w-4" />
              Évaluations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total évaluations</span>
                <span className="font-semibold">{mockEvaluations.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Certificats générés</span>
                <span className="font-semibold text-green-600">
                  {mockEvaluations.filter(e => e.certificatGenere).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Note moyenne</span>
                <span className="font-semibold text-yellow-600">
                  {avgEvaluation.toFixed(1)}/5
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
