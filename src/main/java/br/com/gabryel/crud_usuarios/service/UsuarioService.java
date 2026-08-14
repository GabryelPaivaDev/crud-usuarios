package br.com.gabryel.crud_usuarios.service;

import br.com.gabryel.crud_usuarios.entity.Usuario;
import br.com.gabryel.crud_usuarios.repository.UsuarioRepository;
import br.com.gabryel.crud_usuarios.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    // =========================================================
    // LISTAR USUÁRIOS ATIVOS
    // =========================================================

    public List<Usuario> listarTodos() {
        return repository.findByAtivoTrue();
    }

    // =========================================================
    // BUSCAR USUÁRIO ATIVO POR ID
    // =========================================================

    public Usuario buscarPorId(Long id) {

        return repository.findByIdAndAtivoTrue(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Usuário não encontrado: " + id)
                );
    }

    // =========================================================
    // CRIAR USUÁRIO
    // =========================================================

    public Usuario salvar(Usuario usuario) {

        limparDados(usuario);

        verificarDuplicidade(
                usuario.getEmail(),
                usuario.getCpf(),
                usuario.getTelefone(),
                null
        );

        usuario.setAtivo(true);
        usuario.setDataAcao(LocalDateTime.now());

        return repository.save(usuario);
    }

    // =========================================================
    // ATUALIZAR USUÁRIO
    // =========================================================

    public Usuario atualizar(Long id, Usuario dados) {

        Usuario usuario = buscarPorId(id);

        limparDados(dados);

        verificarDuplicidade(
                dados.getEmail(),
                dados.getCpf(),
                dados.getTelefone(),
                id
        );

        usuario.setNome(dados.getNome());
        usuario.setEmail(dados.getEmail());
        usuario.setCpf(dados.getCpf());
        usuario.setTelefone(dados.getTelefone());
        usuario.setDataNascimento(dados.getDataNascimento());

        /*
         * A senha e o perfil não são alterados por esta operação.
         * Eles serão tratados posteriormente pelo sistema de
         * autenticação/administrador.
         */

        usuario.setDataAcao(LocalDateTime.now());

        return repository.save(usuario);
    }

    // =========================================================
    // EXCLUSÃO LÓGICA
    // =========================================================

    public void excluir(Long id) {

        Usuario usuario = buscarPorId(id);

        usuario.setAtivo(false);
        usuario.setDataAcao(LocalDateTime.now());

        repository.save(usuario);
    }

    public void redefinirSenha(String email, String cpf, LocalDate dataNascimento, String novaSenha) {
        String emailNormalizado = email == null ? null : email.trim().toLowerCase();
        String cpfNormalizado = cpf == null ? null : cpf.replaceAll("\\D", "");

        Usuario usuario = repository.findByEmailAndCpfAndDataNascimento(
                        emailNormalizado, cpfNormalizado, dataNascimento)
                .filter(item -> Boolean.TRUE.equals(item.getAtivo()))
                .orElseThrow(() -> new IllegalArgumentException(
                        "Não foi possível confirmar os dados informados."));

        usuario.setSenha(novaSenha);
        usuario.setDataAcao(LocalDateTime.now());
        repository.save(usuario);
    }

    // =========================================================
    // LIMPEZA DE CPF E TELEFONE
    // =========================================================

    private void limparDados(Usuario usuario) {

        if (usuario.getCpf() != null) {
            usuario.setCpf(
                    usuario.getCpf().replaceAll("\\D", "")
            );
        }

        if (usuario.getTelefone() != null) {
            usuario.setTelefone(
                    usuario.getTelefone().replaceAll("\\D", "")
            );
        }

        if (usuario.getEmail() != null) {
            usuario.setEmail(
                    usuario.getEmail().trim().toLowerCase()
            );
        }
    }

    // =========================================================
    // VERIFICAÇÃO DE DUPLICIDADE
    // =========================================================

    private void verificarDuplicidade(
            String email,
            String cpf,
            String telefone,
            Long id
    ) {

        if (email != null) {

            boolean emailExiste;

            if (id == null) {
                emailExiste = repository.existsByEmail(email);
            } else {
                emailExiste = repository.existsByEmailAndIdNot(email, id);
            }

            if (emailExiste) {
                throw new IllegalArgumentException(
                        "O e-mail informado já está cadastrado."
                );
            }
        }

        if (cpf != null) {

            boolean cpfExiste;

            if (id == null) {
                cpfExiste = repository.existsByCpf(cpf);
            } else {
                cpfExiste = repository.existsByCpfAndIdNot(cpf, id);
            }

            if (cpfExiste) {
                throw new IllegalArgumentException(
                        "O CPF informado já está cadastrado."
                );
            }
        }

        if (telefone != null) {

            boolean telefoneExiste;

            if (id == null) {
                telefoneExiste = repository.existsByTelefone(telefone);
            } else {
                telefoneExiste =
                        repository.existsByTelefoneAndIdNot(telefone, id);
            }

            if (telefoneExiste) {
                throw new IllegalArgumentException(
                        "O telefone informado já está cadastrado."
                );
            }
        }
    }
}
