using AutoMapper;
using WebApiCliente.DTOS;
using WebApiCliente.Models;

namespace WebApiCliente.App_Start
{
    public class AutoMapperConfig : Profile
    {
        public AutoMapperConfig()
        {
            CreateMap<ClienteEntity, ClienteDTO>().ReverseMap();
            CreateMap<ChamadoEntity, ChamadoDTO>().ReverseMap();
        }
    }
}