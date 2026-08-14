package br.com.gabryel.crud_usuarios.controller;

import br.com.gabryel.crud_usuarios.entity.Usuario;
import br.com.gabryel.crud_usuarios.entity.Perfil;
import br.com.gabryel.crud_usuarios.repository.UsuarioRepository;
import br.com.gabryel.crud_usuarios.service.UsuarioService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.time.LocalDate;

/**
 * Autenticação simples por e-mail e senha.
 *
 * Observação: este projeto não usa Spring Security. É uma validação direta
 * de credenciais para fins acadêmicos — o front-end usa a resposta (id,
 * nome, perfil) para decidir qual tela mostrar e para "esconder" as rotas
 * do administrador de quem não é ADMIN. Isso NÃO é uma proteção real de
 * backend (os endpoints de /usuarios continuam acessíveis diretamente por
 * quem souber a URL). Para produção, o próximo passo seria adicionar
 * Spring Security + hash de senha (BCrypt) + token (JWT ou sessão).
 */
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioRepository repository;
    private final UsuarioService service;

    public AuthController(UsuarioRepository repository, UsuarioService service) {
        this.repository = repository;
        this.service = service;
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResposta> registrar(@Valid @RequestBody RegistroRequisicao requisicao) {
        Usuario usuario = new Usuario();
        usuario.setNome(requisicao.nome());
        usuario.setEmail(requisicao.email());
        usuario.setSenha(requisicao.senha());
        usuario.setCpf(requisicao.cpf());
        usuario.setTelefone(requisicao.telefone());
        usuario.setDataNascimento(requisicao.dataNascimento());
        usuario.setPerfil(Perfil.USER);

        Usuario salvo = service.salvar(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(new LoginResposta(
                salvo.getId(), salvo.getNome(), salvo.getEmail(), salvo.getPerfil().name()));
    }

    @PostMapping("/password")
    public ResponseEntity<Void> redefinirSenha(@Valid @RequestBody RecuperacaoRequisicao requisicao) {
        service.redefinirSenha(requisicao.email(), requisicao.cpf(),
                requisicao.dataNascimento(), requisicao.novaSenha());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequisicao requisicao) {

        String email = requisicao.email() == null
                ? null
                : requisicao.email().trim().toLowerCase();

        Usuario usuario = (email == null)
                ? null
                : repository.findByEmail(email).orElse(null);

        boolean credenciaisValidas = usuario != null
                && Boolean.TRUE.equals(usuario.getAtivo())
                && usuario.getSenha() != null
                && usuario.getSenha().equals(requisicao.senha());

        if (!credenciaisValidas) {
            Map<String, String> corpo = new HashMap<>();
            corpo.put("erro", "E-mail ou senha inválidos.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(corpo);
        }

        return ResponseEntity.ok(new LoginResposta(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getPerfil().name()
        ));
    }

    public record LoginRequisicao(String email, String senha) {
    }

    public record RegistroRequisicao(
            @NotBlank String nome, @NotBlank @Email String email, @NotBlank String senha,
            @NotBlank String cpf, @NotBlank String telefone, @NotNull LocalDate dataNascimento) {
    }

    public record RecuperacaoRequisicao(
            @NotBlank @Email String email, @NotBlank String cpf,
            @NotNull LocalDate dataNascimento, @NotBlank String novaSenha) {
    }

    public record LoginResposta(Long id, String nome, String email, String perfil) {
    }

}
