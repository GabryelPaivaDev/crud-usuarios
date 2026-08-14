package br.com.gabryel.crud_usuarios;

import br.com.gabryel.crud_usuarios.entity.Perfil;
import br.com.gabryel.crud_usuarios.entity.Usuario;
import br.com.gabryel.crud_usuarios.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;

@SpringBootApplication
public class CrudUsuariosApplication {

	public static void main(String[] args) {
		SpringApplication.run(CrudUsuariosApplication.class, args);
	}

	@Bean
	CommandLineRunner criarAdministradorInicial(UsuarioRepository repository) {
		return args -> {
			if (repository.findByEmail("admin@unit.edu.br").isPresent()) {
				return;
			}

			Usuario administrador = new Usuario();
			administrador.setNome("Administrador UNIT");
			administrador.setEmail("admin@unit.edu.br");
			administrador.setSenha("admin123");
			administrador.setCpf("00000000000");
			administrador.setTelefone("00000000000");
			administrador.setDataNascimento(LocalDate.of(2000, 1, 1));
			administrador.setPerfil(Perfil.ADMIN);
			repository.save(administrador);
		};
	}

}
