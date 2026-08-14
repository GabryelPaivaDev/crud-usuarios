package br.com.gabryel.crud_usuarios.controller;

import br.com.gabryel.crud_usuarios.entity.Usuario;
import br.com.gabryel.crud_usuarios.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    // =========================================================
    // LISTAR USUÁRIOS ATIVOS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {

        return ResponseEntity.ok(service.listarTodos());
    }

    // =========================================================
    // BUSCAR USUÁRIO POR ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {

        return ResponseEntity.ok(service.buscarPorId(id));
    }

    // =========================================================
    // CADASTRAR USUÁRIO
    // =========================================================

    @PostMapping
    public ResponseEntity<Usuario> salvar(@Valid @RequestBody Usuario usuario) {

        Usuario usuarioSalvo = service.salvar(usuario);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(usuarioSalvo);
    }

    // =========================================================
    // ATUALIZAR USUÁRIO
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizar(
            @PathVariable Long id,
            @RequestBody Usuario usuario
    ) {

        Usuario usuarioAtualizado = service.atualizar(id, usuario);

        return ResponseEntity.ok(usuarioAtualizado);
    }

    // =========================================================
    // EXCLUSÃO LÓGICA
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {

        service.excluir(id);

        return ResponseEntity.noContent().build();
    }
}
