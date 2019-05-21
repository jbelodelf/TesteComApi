using System;

namespace WebApiCliente.DTOS
{
    public class ChamadoDTO
    {
        public Int64 Id { get; set; }
        public Int64 Id_Cliente { get; set; }
        public DateTime DataHora_Abertura { get; set; }
        public bool Fechado { get; set; }
        public DateTime DataHora_Fechamento { get; set; }

        public ClienteDTO Cliente { get; set; }
    }
}