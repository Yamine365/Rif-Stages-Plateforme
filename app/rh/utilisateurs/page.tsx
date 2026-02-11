'use client'

import { useState } from 'react'
import { mockStagiaires, mockTuteurs, mockConventions } from '@/lib/mock-data'
import { DEPARTEMENTS } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  UserPlus,
  Users,
  GraduationCap,
  Mail,
  Key,
  Edit,
  Link as LinkIcon,
} from 'lucide-react'

/* =======================
   TYPES & MOCK DATA
======================= */

type Partenariat = {
  id: string
  nomEntreprise: string
  secteur: string
  nomContact: string
  email: string
  type: string
  statut: string
}

const mockPartenariats: Partenariat[] = [
  {
    id: '1',
    nomEntreprise: 'TechCorp',
    secteur: 'IT',
    nomContact: 'Ali Ben Salah',
    email: 'ali@techcorp.com',
    type: 'Stage',
    statut: 'Actif',
  },
  {
    id: '2',
    nomEntreprise: 'BuildPro',
    secteur: 'BTP',
    nomContact: 'Sami Khelifi',
    email: 'sami@buildpro.com',
    type: 'Emploi',
    statut: 'En attente',
  },
]

/* =======================
   COMPONENT
======================= */

export default function UtilisateursPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [partenariats, setPartenariats] = useState<Partenariat[]>(mockPartenariats)
  const [isAddTuteurDialogOpen, setIsAddTuteurDialogOpen] = useState(false)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [selectedStagiaire, setSelectedStagiaire] =
    useState<(typeof mockStagiaires)[0] | null>(null)

  const [newTuteur, setNewTuteur] = useState({
    nom: '',
    prenom: '',
    email: '',
    departement: '',
    poste: '',
  })

  /* =======================
     FILTERS
  ======================= */

  const filteredStagiaires = mockStagiaires.filter((s) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      s.nom.toLowerCase().includes(searchLower) ||
      s.prenom.toLowerCase().includes(searchLower) ||
      s.email.toLowerCase().includes(searchLower) ||
      s.ecole.toLowerCase().includes(searchLower)
    )
  })

  const filteredTuteurs = mockTuteurs.filter((t) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      t.nom.toLowerCase().includes(searchLower) ||
      t.prenom.toLowerCase().includes(searchLower) ||
      t.email.toLowerCase().includes(searchLower) ||
      t.departement.toLowerCase().includes(searchLower)
    )
  })

  const filteredPartenariats = partenariats.filter((p) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      p.nomEntreprise.toLowerCase().includes(searchLower) ||
      p.nomContact.toLowerCase().includes(searchLower) ||
      p.email.toLowerCase().includes(searchLower)
    )
  })


  /* =======================
     ACTIONS
  ======================= */

  const openPartnershipDetails = (partenariat: Partenariat) => {
    console.log('Détails partenariat :', partenariat)
  }

  const handleAddTuteur = () => {
    setIsAddTuteurDialogOpen(false)
    setNewTuteur({ nom: '', prenom: '', email: '', departement: '', poste: '' })
  }

  const openAssignDialog = (stagiaire: (typeof mockStagiaires)[0]) => {
    setSelectedStagiaire(stagiaire)
    setIsAssignDialogOpen(true)
  }

  const getTuteurForStagiaire = (stagiaireId: string) => {
    const convention = mockConventions.find(
      (c) => c.stagiaireId === stagiaireId
    )
    if (!convention) return null

    return mockTuteurs.find(
      (t) =>
        `${t.prenom} ${t.nom}` === convention.contenu.tuteurNom ||
        `${t.nom} ${t.prenom}` === convention.contenu.tuteurNom
    )
  }




  /* ===== JSX CONTINUE ICI ===== */






  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion des utilisateurs</h1>
          <p className="mt-1 text-muted-foreground">
            Gérez les comptes tuteurs et stagiaires
          </p>
        </div>
        <Button onClick={() => setIsAddTuteurDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter un tuteur
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="stagiaires">
        <TabsList>
          <TabsTrigger value="stagiaires" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            Stagiaires ({mockStagiaires.length})
          </TabsTrigger>
          <TabsTrigger value="tuteurs" className="gap-2">
            <Users className="h-4 w-4" />
            Tuteurs ({mockTuteurs.length})
          </TabsTrigger>
          <TabsTrigger value="partenariats" className="gap-2">
            <LinkIcon className="h-4 w-4" />
            Partenariats ({mockPartenariats.length})
          </TabsTrigger>

        </TabsList>

        <TabsContent value="stagiaires" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Liste des stagiaires</CardTitle>
              <CardDescription>
                {filteredStagiaires.length} stagiaire(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Stagiaire</TableHead>
                      <TableHead>École</TableHead>
                      <TableHead>Spécialité</TableHead>
                      <TableHead>Tuteur assigné</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStagiaires.map((stagiaire) => {
                      const tuteur = getTuteurForStagiaire(stagiaire.id)
                      
                      return (
                        <TableRow key={stagiaire.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-xs font-semibold text-primary">
                                  {stagiaire.prenom.charAt(0)}{stagiaire.nom.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">{stagiaire.prenom} {stagiaire.nom}</p>
                                <p className="text-sm text-muted-foreground">{stagiaire.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{stagiaire.ecole}</TableCell>
                          <TableCell>{stagiaire.specialite}</TableCell>
                          <TableCell>
                            {tuteur ? (
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                                  <span className="text-xs font-semibold text-accent-foreground">
                                    {tuteur.prenom.charAt(0)}{tuteur.nom.charAt(0)}
                                  </span>
                                </div>
                                <span className="text-sm">{tuteur.prenom} {tuteur.nom}</span>
                              </div>
                            ) : (
                              <Badge variant="outline">Non assigné</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => openAssignDialog(stagiaire)}
                              >
                                <LinkIcon className="h-4 w-4 mr-1" />
                                {tuteur ? 'Réassigner' : 'Assigner'}
                              </Button>
                              <Button asChild variant="ghost" size="icon">
                                <a href={`mailto:${stagiaire.email}`} target="_blank" rel="noreferrer">
                                <Mail className="h-4 w-4" />
                                <span className="sr-only">Contacter</span></a>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    {filteredStagiaires.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Aucun stagiaire trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tuteurs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Liste des tuteurs</CardTitle>
              <CardDescription>
                {filteredTuteurs.length} tuteur(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tuteur</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Poste</TableHead>
                      <TableHead>Stagiaires</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTuteurs.map((tuteur) => (
                      <TableRow key={tuteur.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                              <span className="text-xs font-semibold text-accent-foreground">
                                {tuteur.prenom.charAt(0)}{tuteur.nom.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{tuteur.prenom} {tuteur.nom}</p>
                              <p className="text-sm text-muted-foreground">{tuteur.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{tuteur.departement}</TableCell>
                        <TableCell>{tuteur.poste}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {tuteur.stagiairesIds.length} stagiaire(s)
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Modifier</span>
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Key className="h-4 w-4" />
                              <span className="sr-only">Réinitialiser mot de passe</span>
                            </Button>
                            <Button asChild variant="ghost" size="icon">
                              <a href={`mailto:${tuteur.email}`} target="_blank" rel="noreferrer">
                              <Mail className="h-4 w-4" />
                              <span className="sr-only">Contacter</span></a>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredTuteurs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Aucun tuteur trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partenariats" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Liste des partenariats</CardTitle>
              <CardDescription>
                {filteredPartenariats.length} demande(s) de partenariat
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Entreprise</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredPartenariats.map((partenariat) => (
                      <TableRow key={partenariat.id}>
                        {/* Entreprise */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-semibold text-primary">
                                {partenariat.nomEntreprise.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{partenariat.nomEntreprise}</p>
                              <p className="text-sm text-muted-foreground">
                                {partenariat.secteur}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Contact */}
                        <TableCell>
                          <p className="text-sm font-medium">{partenariat.nomContact}</p>
                          <p className="text-sm text-muted-foreground">
                            {partenariat.email}
                          </p>
                        </TableCell>

                        {/* Type */}
                        <TableCell>
                          <Badge variant="secondary">{partenariat.type}</Badge>
                        </TableCell>

                        {/* Statut */}
                        <TableCell>
                          <Badge
                            variant={
                              partenariat.statut === 'Accepté'
                                ? 'default'
                                : partenariat.statut === 'Refusé'
                                ? 'destructive'
                                : 'outline'
                            }
                          >
                            {partenariat.statut}
                          </Badge>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openPartnershipDetails(partenariat)}
                            >
                              Voir
                            </Button> */}
                            

                            <Button asChild variant="ghost" size="icon">
                              <a href={`mailto:${partenariat.email}`} target="_blank" rel="noreferrer">
                              <Mail className="h-4 w-4" />
                              <span className="sr-only">Contacter</span></a>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}

                    {filteredPartenariats.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-muted-foreground"
                        >
                          Aucune demande de partenariat
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>


                    


      </Tabs>

      {/* Add Tuteur Dialog */}
      <Dialog open={isAddTuteurDialogOpen} onOpenChange={setIsAddTuteurDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un tuteur</DialogTitle>
            <DialogDescription>
              Créez un nouveau compte tuteur
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input
                  value={newTuteur.nom}
                  onChange={(e) => setNewTuteur(prev => ({ ...prev, nom: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Prénom</Label>
                <Input
                  value={newTuteur.prenom}
                  onChange={(e) => setNewTuteur(prev => ({ ...prev, prenom: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email professionnel</Label>
              <Input
                type="email"
                placeholder="prenom.nom@rif.fr"
                value={newTuteur.email}
                onChange={(e) => setNewTuteur(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Département</Label>
              <Select 
                value={newTuteur.departement} 
                onValueChange={(v) => setNewTuteur(prev => ({ ...prev, departement: v }))}
              >
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
              <Label>Poste</Label>
              <Input
                placeholder="Chef de projet, Responsable..."
                value={newTuteur.poste}
                onChange={(e) => setNewTuteur(prev => ({ ...prev, poste: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTuteurDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddTuteur}>
              <UserPlus className="mr-2 h-4 w-4" />
              Créer le compte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Tuteur Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assigner un tuteur</DialogTitle>
            <DialogDescription>
              {selectedStagiaire && `Assigner un tuteur à ${selectedStagiaire.prenom} ${selectedStagiaire.nom}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tuteur</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un tuteur" />
                </SelectTrigger>
                <SelectContent>
                  {mockTuteurs.map((tuteur) => (
                    <SelectItem key={tuteur.id} value={tuteur.id}>
                      {tuteur.prenom} {tuteur.nom} - {tuteur.departement}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={() => setIsAssignDialogOpen(false)}>
              Assigner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
    </div>
  )
}
