'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { mockCandidatures, mockStagiaires, mockConventions, mockTuteurs } from '@/lib/mock-data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Users,
  FileCheck,
  UserPlus,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Calendar,
} from 'lucide-react'

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  brouillon: { label: 'Brouillon', variant: 'secondary' },
  soumise: { label: 'En attente', variant: 'outline' },
  en_revision: { label: 'En révision', variant: 'secondary' },
  acceptee: { label: 'Acceptée', variant: 'default' },
  refusee: { label: 'Refusée', variant: 'destructive' },
}

export default function RHDashboard() {
  const { user } = useAuth()

  if (!user) return null

  // Stats
  const totalCandidatures = mockCandidatures.length
  const candidaturesEnAttente = mockCandidatures.filter(c => c.status === 'soumise').length
  const candidaturesAcceptees = mockCandidatures.filter(c => c.status === 'acceptee').length
  const candidaturesRefusees = mockCandidatures.filter(c => c.status === 'refusee').length
  const tauxAcceptation = totalCandidatures > 0 
    ? Math.round((candidaturesAcceptees / totalCandidatures) * 100) 
    : 0

  // Recent candidatures
  const recentCandidatures = mockCandidatures
    .filter(c => c.status !== 'brouillon')
    .sort((a, b) => new Date(b.dateSoumission || '').getTime() - new Date(a.dateSoumission || '').getTime())
    .slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Tableau de bord RH
        </h1>
        <p className="mt-1 text-muted-foreground">
          Gérez les candidatures et les stagiaires du groupe RIF
        </p>
      </div>

      {/* Stats cards */}
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
              Toutes les candidatures
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En attente
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{candidaturesEnAttente}</div>
            <p className="text-xs text-muted-foreground mt-1">
              À traiter
            </p>
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
            <div className="text-2xl font-bold text-primary">{mockStagiaires.filter(s => s.tuteurId).length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              En stage actuellement
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
            <p className="text-xs text-muted-foreground mt-1">
              {candidaturesAcceptees} acceptées / {totalCandidatures}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-start gap-4 space-y-0">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base">Candidatures</CardTitle>
              <CardDescription>
                {candidaturesEnAttente} en attente de traitement
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/rh/candidatures">
              <Button variant="outline" className="w-full bg-transparent">
                Gérer les candidatures
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-start gap-4 space-y-0">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileCheck className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base">Conventions</CardTitle>
              <CardDescription>
                {mockConventions.length} conventions générées
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/rh/conventions">
              <Button variant="outline" className="w-full bg-transparent">
                Voir les conventions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-start gap-4 space-y-0">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base">Utilisateurs</CardTitle>
              <CardDescription>
                {mockTuteurs.length} tuteurs, {mockStagiaires.length} stagiaires
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/rh/utilisateurs">
              <Button variant="outline" className="w-full bg-transparent">
                Gérer les utilisateurs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent candidatures */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Candidatures récentes</CardTitle>
            <CardDescription>Les dernières candidatures soumises</CardDescription>
          </div>
          <Link href="/rh/candidatures">
            <Button variant="ghost" size="sm">
              Voir tout
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCandidatures.map((candidature) => {
              const stagiaire = mockStagiaires.find(s => s.id === candidature.stagiaireId)
              if (!stagiaire) return null
              
              return (
                <div 
                  key={candidature.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {stagiaire.prenom.charAt(0)}{stagiaire.nom.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{stagiaire.prenom} {stagiaire.nom}</p>
                      <p className="text-sm text-muted-foreground">
                        {stagiaire.ecole} - {stagiaire.specialite}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {candidature.dateSoumission}
                      </p>
                    </div>
                    <Badge variant={statusLabels[candidature.status].variant}>
                      {statusLabels[candidature.status].label}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
