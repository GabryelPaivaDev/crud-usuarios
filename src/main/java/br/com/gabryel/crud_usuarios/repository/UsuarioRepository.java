package br.com.gabryel.crud_usuarios.repository;

import br.com.gabryel.crud_usuarios.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.time.LocalDate;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    List<Usuario> findByAtivoTrue();

    Optional<Usuario> findByIdAndAtivoTrue(Long id);

    Optional<Usuario> findByEmail(String email);

    Optional<Usuario> findByEmailAndCpfAndDataNascimento(String email, String cpf, LocalDate dataNascimento);

    boolean existsByEmail(String email);

    boolean existsByCpf(String cpf);

    boolean existsByTelefone(String telefone);

    boolean existsByEmailAndIdNot(String email, Long id);

    boolean existsByCpfAndIdNot(String cpf, Long id);

    boolean existsByTelefoneAndIdNot(String telefone, Long id);
}
