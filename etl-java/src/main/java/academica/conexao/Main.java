package academica.conexao;

import academica.conexao.service.ExtractService;

public class Main {
    public static void main(String[] args) {
        ExtractService extractService = new ExtractService();
        extractService.extract();
    }
}