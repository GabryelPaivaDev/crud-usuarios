package br.com.gabryel.crud_usuarios.repository;

import br.com.gabryel.crud_usuarios.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

}