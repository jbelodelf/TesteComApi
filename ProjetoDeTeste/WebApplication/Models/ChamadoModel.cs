using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication.Models
{
    public class ChamadoModel
    {
        public Int64 Id { get; set; }
        public Int64 Id_Cliente { get; set; }
        public DateTime DataHora_Abertura { get; set; }
        public bool Fechado { get; set; }
        public DateTime DataHora_Fechamento { get; set; }

        public ClienteModel Cliente { get; set; }
    }
}