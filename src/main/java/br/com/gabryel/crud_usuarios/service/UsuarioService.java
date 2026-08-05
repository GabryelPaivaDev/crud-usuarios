package br.com.gabryel.crud_usuarios.service;

import br.com.gabryel.crud_usuarios.entity.Usuario;
import br.com.gabryel.crud_usuarios.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public List<Usuario> listarTodos() {
        return repository.findAll();
    }

    public Usuario buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    public Usuario salvar(Usuario usuario) {

        usuario.setDataCadastro(LocalDate.now());

        return repository.save(usuario);
    }

    public Usuario atualizar(Long id, Usuario usuario) {

        Usuario existente = buscarPorId(id);

        existente.setNome(usuario.getNome());
        existente.setEmail(usuario.getEmail());
        existente.setCpf(usuario.getCpf());
        existente.setTelefone(usuario.getTelefone());
        existente.setDataNascimento(usuario.getDataNascimento());

        return repository.save(existente);
    }

    public void excluir(Long id) {

        buscarPorId(id);

        repository.deleteById(id);
    }

}