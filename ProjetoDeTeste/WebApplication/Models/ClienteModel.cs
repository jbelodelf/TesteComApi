using System;
using System.ComponentModel;

namespace WebApplication.Models
{
    public class ClienteModel
    {
        public Int64 Id { get; set; }
        [DisplayName("CNPJ/CPF")]
        public string CNPJ_CPF { get; set; }
        [DisplayName("Razão social")]
        public string RazaoSocial_Nome { get; set; }
        [DisplayName("Cep")]
        public string CEP { get; set; }
        [DisplayName("Rua")]
        public string Logradouro { get; set; }
        [DisplayName("Número")]
        public string Logradouro_Numero { get; set; }
        [DisplayName("Complemento")]
        public string Logradouro_Complemento { get; set; }
        [DisplayName("Bairro")]
        public string Logradouro_Bairro { get; set; }
        [DisplayName("Cidade")]
        public string Logradouro_Cidade { get; set; }
        [DisplayName("Uf")]
        public string Logradouro_UF { get; set; }
        [DisplayName("Telefone")]
        public string Telefone { get; set; }
        [DisplayName("SLA")]
        public int SLA_RespostaTempo { get; set; }

    }
}