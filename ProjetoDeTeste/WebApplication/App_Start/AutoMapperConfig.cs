using AutoMapper;
using WebApplication.DTOS;
using WebApplication.Models;

namespace WebApplication.App_Start
{
    public class AutoMapperConfig : Profile
    {
        public AutoMapperConfig()
        {
            CreateMap<ClienteModel, ClienteDTO>().ReverseMap();
            CreateMap<ChamadoModel, ChamadoDTO>().ReverseMap();
        }
    }
}