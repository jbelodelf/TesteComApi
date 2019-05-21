using System;

namespace WebApplication.DTOS
{
    public class ClienteDTO
    {
        public Int64 Id { get; set; }
        public string CNPJ_CPF { get; set; }
        public string RazaoSocial_Nome { get; set; }
        public string CEP { get; set; }
        public string Logradouro { get; set; }
        public string Logradouro_Numero { get; set; }
        public string Logradouro_Complemento { get; set; }
        public string Logradouro_Bairro { get; set; }
        public string Logradouro_Cidade { get; set; }
        public string Logradouro_UF { get; set; }
        public string Telefone { get; set; }
        public int SLA_RespostaTempo { get; set; }
    }
}