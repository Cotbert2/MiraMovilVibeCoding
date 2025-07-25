import React, { useState } from 'react';
import { Trash2, Filter, AlertTriangle } from 'lucide-react';
import { Header } from '../common/Header';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Toast } from '../common/Toast';
import { User } from '../../types';

interface ListarUsuariosScreenProps {
  usuarios: User[];
  eliminarUsuario: (id: string) => Promise<{ success: boolean; message: string }>;
  setPantallaActual: (pantalla: any) => void;
}

export const ListarUsuariosScreen: React.FC<ListarUsuariosScreenProps> = ({
  usuarios,
  eliminarUsuario,
  setPantallaActual
}) => {
  const [filtroRol, setFiltroRol] = useState<string>('todos');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);

  const usuariosFiltrados = usuarios.filter(usuario => {
    const coincideRol = filtroRol === 'todos' || usuario.rol === filtroRol;
    const coincideEstado = filtroEstado === 'todos' || usuario.estado === filtroEstado;
    return coincideRol && coincideEstado;
  });

  const handleEliminarUsuario = async (id: string) => {
    const result = await eliminarUsuario(id);
    
    if (result.success) {
      setToast({ type: 'success', message: result.message });
    } else {
      setToast({ type: 'error', message: result.message });
    }
  };

  const getEstadoBadgeVariant = (estado: string) => {
    return estado === 'Activo' ? 'default' : 'secondary';
  };

  if (usuarios.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          title="Listar Usuarios"
          showBackButton={true}
          onBack={() => setPantallaActual('gestionUsuarios')}
        />
        
        <div className="p-4 flex items-center justify-center min-h-96">
          <div className="text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-medium">No hay usuarios registrados</h3>
            <p className="text-muted-foreground">
              Aún no se han registrado usuarios en el sistema.
            </p>
            <Button onClick={() => setPantallaActual('registrarUsuario')}>
              Crear Primer Usuario
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      
      <Header
        title="Listar Usuarios"
        showBackButton={true}
        onBack={() => setPantallaActual('gestionUsuarios')}
      />
      
      <div className="p-4 space-y-4">
        {/* Filtros */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filtros</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Rol</label>
                <Select value={filtroRol} onValueChange={setFiltroRol}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los roles</SelectItem>
                    <SelectItem value="Jefe de Compras">Jefe de Compras</SelectItem>
                    <SelectItem value="Bodeguero">Bodeguero</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Estado</label>
                <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de usuarios */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">
              Usuarios ({usuariosFiltrados.length})
            </h3>
          </div>
          
          {usuariosFiltrados.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  No se encontraron usuarios con los filtros seleccionados.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {usuariosFiltrados.map((usuario) => (
                <Card key={usuario.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">
                            {usuario.nombre} {usuario.apellido}
                          </h4>
                          <Badge variant={getEstadoBadgeVariant(usuario.estado)}>
                            {usuario.estado}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span>Rol: <strong>{usuario.rol}</strong></span>
                            <span>Usuario: <strong>{usuario.usuario}</strong></span>
                          </div>
                          <div>Cédula: {usuario.cedula}</div>
                          <div>Email: {usuario.correo}</div>
                          <div>Creado: {usuario.fechaCreacion}</div>
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
                              <AlertDialogDescription>
                                ¿Está seguro que desea eliminar al usuario{' '}
                                <strong>{usuario.nombre} {usuario.apellido}</strong>?
                                <br />
                                Esta acción no se puede deshacer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleEliminarUsuario(usuario.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};