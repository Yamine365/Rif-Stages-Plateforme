'use client'

import { useState } from 'react'
import { mockConventions, mockStagiaires, mockTuteurs, mockCandidatures } from '@/lib/mock-data'
import { DEPARTEMENTS } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Search,
  FileCheck,
  Download,
  Plus,
  Eye,
  Send,
  Calendar,
  User,
  Building2,
} from 'lucide-react'
import type { ConventionStatus } from '@/lib/types'

const statusConfig: Record<ConventionStatus, { label: string; color: string }> = {
  generee: { label: 'Générée', color: 'bg-blue-100 text-blue-800' },
  envoyee: { label: 'Envoyée', color: 'bg-yellow-100 text-yellow-800' },
  signee_stagiaire: { label: 'Signée (stagiaire)', color: 'bg-orange-100 text-orange-800' },
  signee_complete: { label: 'Signée (toutes parties)', color: 'bg-green-100 text-green-800' },
}

export default function ConventionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
  const [selectedStagiaire, setSelectedStagiaire] = useState('')
  const [selectedTuteur, setSelectedTuteur] = useState('')
  const [selectedDepartement, setSelectedDepartement] = useState('')

  // Get accepted candidatures without conventions
  const acceptedCandidatures = mockCandidatures.filter(c => 
    c.status === 'acceptee' && 
    !mockConventions.some(conv => conv.candidatureId === c.id)
  )

  const filteredConventions = mockConventions.filter(conv => {
    if (searchTerm) {
      const stagiaire = mockStagiaires.find(s => s.id === conv.stagiaireId)
      if (!stagiaire) return false
      const searchLower = searchTerm.toLowerCase()
      return (
        stagiaire.nom.toLowerCase().includes(searchLower) ||
        stagiaire.prenom.toLowerCase().includes(searchLower) ||
        conv.contenu.departement.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  const handleGenerate = () => {
    // In real app, this would create the convention
    setIsGenerateDialogOpen(false)
    setSelectedStagiaire('')
    setSelectedTuteur('')
    setSelectedDepartement('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Conventions de stage</h1>
          <p className="mt-1 text-muted-foreground">
            Générez et gérez les conventions des stagiaires
          </p>
        </div>
        <Button onClick={() => setIsGenerateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle convention
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom ou département..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{mockConventions.length}</p>
            <p className="text-sm text-muted-foreground">Total conventions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-green-600">
              {mockConventions.filter(c => c.status === 'signee_complete').length}
            </p>
            <p className="text-sm text-muted-foreground">Entièrement signées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-yellow-600">
              {mockConventions.filter(c => c.status === 'envoyee' || c.status === 'signee_stagiaire').length}
            </p>
            <p className="text-sm text-muted-foreground">En attente</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-blue-600">
              {acceptedCandidatures.length}
            </p>
            <p className="text-sm text-muted-foreground">À générer</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des conventions</CardTitle>
          <CardDescription>
            {filteredConventions.length} convention(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stagiaire</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead>Tuteur</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConventions.map((convention) => {
                  const stagiaire = mockStagiaires.find(s => s.id === convention.stagiaireId)
                  if (!stagiaire) return null
                  
                  return (
                    <TableRow key={convention.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary">
                              {stagiaire.prenom.charAt(0)}{stagiaire.nom.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{stagiaire.prenom} {stagiaire.nom}</p>
                            <p className="text-sm text-muted-foreground">{stagiaire.ecole}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{convention.contenu.departement}</TableCell>
                      <TableCell>{convention.contenu.tuteurNom}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{new Date(convention.contenu.dateDebut).toLocaleDateString('fr-FR')}</p>
                          <p className="text-muted-foreground">
                            au {new Date(convention.contenu.dateFin).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusConfig[convention.status].color}>
                          {statusConfig[convention.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Voir</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Télécharger</span>
                          </Button>
                          {convention.status === 'generee' && (
                            <Button variant="ghost" size="icon">
                              <Send className="h-4 w-4" />
                              <span className="sr-only">Envoyer</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filteredConventions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Aucune convention trouvée
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Generate Dialog */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Générer une convention</DialogTitle>
            <DialogDescription>
              Créez une nouvelle convention de stage
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Stagiaire</Label>
              <Select value={selectedStagiaire} onValueChange={setSelectedStagiaire}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un stagiaire" />
                </SelectTrigger>
                <SelectContent>
                  {acceptedCandidatures.map((cand) => {
                    const stagiaire = mockStagiaires.find(s => s.id === cand.stagiaireId)
                    if (!stagiaire) return null
                    return (
                      <SelectItem key={cand.id} value={cand.id}>
                        {stagiaire.prenom} {stagiaire.nom}
                      </SelectItem>
                    )
                  })}
                  {acceptedCandidatures.length === 0 && (
                    <SelectItem value="" disabled>
                      Aucune candidature acceptée sans convention
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Département</Label>
              <Select value={selectedDepartement} onValueChange={setSelectedDepartement}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un département" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTEMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tuteur</Label>
              <Select value={selectedTuteur} onValueChange={setSelectedTuteur}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un tuteur" />
                </SelectTrigger>
                <SelectContent>
                  {mockTuteurs
                    .filter(t => !selectedDepartement || t.departement === selectedDepartement)
                    .map((tuteur) => (
                      <SelectItem key={tuteur.id} value={tuteur.id}>
                        {tuteur.prenom} {tuteur.nom} - {tuteur.poste}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Date de début</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Date de fin</Label>
                <Input type="date" />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleGenerate}>
              <FileCheck className="mr-2 h-4 w-4" />
              Générer la convention
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
