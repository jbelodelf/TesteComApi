using AutoMapper;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Web;
using System.Web.Mvc;
using WebApplication.DTOS;
using WebApplication.Models;

namespace WebApplication.Controllers
{
    public class ClienteController : Controller
    {
        private static readonly string _serviceKey = "QWRtaW46UGFzc3dvcmRBZG1pbg==";

        // GET: Cliente
        public ActionResult Index()
        {
            ClienteModel cliente = new ClienteModel();
            return View(cliente);
        }

        public ActionResult ListarClientes()
        {
            var clientesDTO = new List<ClienteDTO>();
            string request = "GetClientes";
            HttpResponseMessage response = null;

            using (HttpClient client = new HttpClient())
            {
                request = string.Format("{0}", request);
                ConfigurarHttpClient(client);
                response = client.GetAsync(request).Result;

                if (response.StatusCode != System.Net.HttpStatusCode.OK)
                {
                    //Retorno.WebApi.Status = response.StatusCode.ToString();
                    //Retorno.WebApi.Message = response.ToString();
                    return null;
                }

                var retorno = response.Content.ReadAsStringAsync().Result;
                if (String.IsNullOrEmpty(retorno))
                    return null;

                clientesDTO = JsonConvert.DeserializeObject<List<ClienteDTO>>(retorno);
                List<ClienteModel> clientes = Mapper.Map<List<ClienteDTO>, List<ClienteModel>>(clientesDTO);

                return PartialView("~/Views/Cliente/_ListarClientes.cshtml", clientes);
            }
        }

        public ActionResult SavarCliente(ClienteModel cliente)
        {
            string request;
            string mensagemResp = "Erro ao salvar restro!";
            if (cliente.Id > 0)
            {
                request = "Update";
            }
            else
            {
                request = "Insert";
            }

            HttpResponseMessage response = null;

            using (var client = new HttpClient())
            {
                ClienteDTO clienteDTO = Mapper.Map<ClienteModel, ClienteDTO>(cliente);

                ConfigurarHttpClient(client);
                string parametroJSON = JsonConvert.SerializeObject(clienteDTO);
                StringContent conteudo = new StringContent(parametroJSON, Encoding.UTF8, "application/json");
                response = client.PostAsync(request, conteudo).Result;
            }

            string retorno = string.Empty;

            if (response.IsSuccessStatusCode)
            {
                mensagemResp = "Registro salvo com sucesso!";
                retorno = response.Content.ReadAsStringAsync().Result;
            }

            return Json(new { retorno = response.StatusCode, mensagem = mensagemResp }, JsonRequestBehavior.AllowGet);

        }

        public ActionResult DeleterCliente(int id)
        {
            string request = "Delete";
            string mensagemResp = "Registro excluído com sucesso!";
            HttpResponseMessage response = null;

            using (HttpClient client = new HttpClient())
            {
                request = string.Format("{0}?id={1}", request, id);
                ConfigurarHttpClient(client);
                response = client.GetAsync(request).Result;

                if (response.StatusCode != System.Net.HttpStatusCode.OK)
                {
                    return null;
                }

                var retorno = response.Content.ReadAsStringAsync().Result;
                if (String.IsNullOrEmpty(retorno))
                    return null;

                return Json(new { retorno = response.StatusCode, mensagem = mensagemResp }, JsonRequestBehavior.AllowGet);
            }
        }

        private void ConfigurarHttpClient(HttpClient client)
        {
            client.BaseAddress = new Uri("http://localhost:51424/Cliente/");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", _serviceKey);
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }

    }
}