using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using WebApiCliente.Models;
using WebApiCliente.Models.Contexts;
using System.Data.Entity;
using WebApiCliente.DTOS;
using AutoMapper;
using System.Net.Http;
using System.Net;

namespace WebApiCliente.Controllers
{
    public class ClienteController : ApiController
    {
        // GET: api/Cliente
        [HttpGet]
        [Route("Cliente/GetClientes")]
        public HttpResponseMessage GetClientes()
        {
            using (var context = new TexteContext())
            {
                var clientesEntity = context.Cliente.ToList();
                List<ClienteDTO> clientes = Mapper.Map<List<ClienteEntity>, List<ClienteDTO>>(clientesEntity);
                return Request.CreateResponse(HttpStatusCode.OK, clientes, "application/json");
            }
        }

        // GET: api/Cliente/5
        [Route("Values/GetClienteById")]
        public HttpResponseMessage GetClienteById(int id)
        {
            using (var context = new TexteContext())
            {
                var cliente = context.Cliente.FirstOrDefault(u => u.Id == id);
                ClienteDTO clienteDTO = Mapper.Map<ClienteEntity, ClienteDTO>(cliente);
                return Request.CreateResponse(HttpStatusCode.OK, cliente, "application/json");
            }
        }

        // POST: api/Cliente
        [HttpPost]
        [Route("Cliente/Insert")]
        [BasicAuthentication]
        public HttpResponseMessage Insert([FromBody]ClienteDTO cliente)
        {
            using (var context = new TexteContext())
            {
                ClienteEntity clienteEntity = Mapper.Map<ClienteDTO, ClienteEntity>(cliente);
                var clientes = context.Cliente.Add(clienteEntity);
                context.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, cliente, "application/json");
            }
        }

        // POST: api/Cliente
        [HttpPost]
        [Route("Cliente/Update")]
        [BasicAuthentication]
        public HttpResponseMessage Update([FromBody]ClienteDTO cliente)
        {
            using (var context = new TexteContext())
            {
                ClienteEntity clienteEntity = Mapper.Map<ClienteDTO, ClienteEntity>(cliente);
                var clientes = context.Entry(clienteEntity).State = EntityState.Modified;
                context.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, cliente, "application/json");
            }
        }

        // DELETE: api/Cliente/5
        [HttpGet]
        [Route("Cliente/Delete")]
        [BasicAuthentication]
        public HttpResponseMessage Delete(int id)
        {
            using (var context = new TexteContext())
            {
                var cliente = context.Cliente.FirstOrDefault(u => u.Id == id);
                context.Entry<ClienteEntity>(cliente).State = EntityState.Deleted;
                context.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, cliente, "application/json");
            }
        }
    }
}
