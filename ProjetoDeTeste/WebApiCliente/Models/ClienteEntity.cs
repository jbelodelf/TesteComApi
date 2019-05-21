using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace WebApiCliente.Models
{
    [Table("Clientes")]
    public class ClienteEntity
    {
        [Key]
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