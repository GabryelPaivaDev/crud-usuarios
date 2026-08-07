package br.com.gabryel.crud_usuarios.repository;

import br.com.gabryel.crud_usuarios.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    boolean existsByEmail(String email);

    boolean existsByCpf(String cpf);

    Optional<Usuario> findByEmail(String email);

    Optional<Usuario> findByCpf(String cpf);

}