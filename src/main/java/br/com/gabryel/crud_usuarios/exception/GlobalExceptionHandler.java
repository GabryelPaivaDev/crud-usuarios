package br.com.gabryel.crud_usuarios.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.HashMap;
import java.util.Map;

/**
 * Centraliza o tratamento de erros da API. Toda resposta de erro sai em
 * JSON no formato { "erro": "mensagem amigável" }, nunca a exceção crua
 * do Hibernate/PostgreSQL ou um stacktrace.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /** Usuário não encontrado por ID (buscar/editar/excluir). */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> tratarNaoEncontrado(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(corpoDeErro(ex.getMessage()));
    }

    /** CPF ou e-mail duplicado (constraint UNIQUE do banco). */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> tratarViolacaoDeIntegridade(DataIntegrityViolationException ex) {

        String causaRaiz = ex.getMostSpecificCause() != null
                ? ex.getMostSpecificCause().getMessage()
                : ex.getMessage();

        String mensagem = "Não foi possível salvar o usuário. Verifique os dados informados.";

        if (causaRaiz != null) {
            String textoEmMinusculo = causaRaiz.toLowerCase();

            if (textoEmMinusculo.contains("(email)")) {
                mensagem = "E-mail já cadastrado.";
            } else if (textoEmMinusculo.contains("(cpf)")) {
                mensagem = "CPF já cadastrado.";
            } else if (textoEmMinusculo.contains("(telefone)")) {
                mensagem = "Telefone já cadastrado.";
            }
        }

        return ResponseEntity.status(HttpStatus.CONFLICT).body(corpoDeErro(mensagem));
    }

    /** Falhas de @NotBlank, @Email etc. definidas na entidade Usuario. */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> tratarValidacao(MethodArgumentNotValidException ex) {

        String mensagem = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(FieldError::getDefaultMessage)
                .orElse("Dados inválidos. Verifique os campos preenchidos.");

        return ResponseEntity.badRequest().body(corpoDeErro(mensagem));
    }

    /** JSON malformado ou ausente no corpo da requisição. */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> tratarJsonInvalido(HttpMessageNotReadableException ex) {
        return ResponseEntity.badRequest().body(corpoDeErro("Dados inválidos. Verifique o formato enviado."));
    }

    /** Ex.: acessar /usuarios/abc em vez de um ID numérico. */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, String>> tratarTipoInvalido(MethodArgumentTypeMismatchException ex) {
        return ResponseEntity.badRequest().body(corpoDeErro("Identificador inválido."));
    }

    /** Rede de segurança: qualquer outro erro não mapeado vira 500 genérico e seguro. */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> tratarErroGenerico(RuntimeException ex) {
        return ResponseEntity.internalServerError()
                .body(corpoDeErro("Erro interno no servidor. Tente novamente mais tarde."));
    }

    private Map<String, String> corpoDeErro(String mensagem) {
        Map<String, String> corpo = new HashMap<>();
        corpo.put("erro", mensagem);
        return corpo;
    }

}