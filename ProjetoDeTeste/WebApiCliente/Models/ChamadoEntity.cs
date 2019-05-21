using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApiCliente.Models
{
    [Table("Chamados")]
    public class ChamadoEntity
    {
        public ChamadoEntity()
        {
            Cliente = new ClienteEntity();
        }

        [Key]
        public Int64 Id { get; set; }
        public Int64 Id_Cliente { get; set; }
        public DateTime DataHora_Abertura { get; set; }
        public bool Fechado { get; set; }
        public DateTime DataHora_Fechamento { get; set; }

        [ForeignKey("Id_Cliente")]
        public ClienteEntity Cliente { get; set; }
    }
}