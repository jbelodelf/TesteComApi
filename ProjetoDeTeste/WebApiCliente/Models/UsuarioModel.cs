using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApiCliente.Models
{
    public class UsuarioModel
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }

        public List<UsuarioModel> GetUsuario()
        {
            try
            {
                return new List<UsuarioModel>
                {
                    new UsuarioModel { Id = 1, UserName = "Admin", Password = "PasswordAdmin"}
                };
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}