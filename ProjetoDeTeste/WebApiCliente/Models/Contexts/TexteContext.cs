using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Data.SQLite;

namespace WebApiCliente.Models.Contexts
{
    public class TexteContext : DbContext
    {
        public TexteContext()
            : base(new SQLiteConnection()
            {
                ConnectionString = new SQLiteConnectionStringBuilder() { DataSource = "F:\\Projetos Gerais\\Projetos-Testes\\ProjetoDeTeste\\DataBase\\TesteDataBase.db", ForeignKeys = true }.ConnectionString
            }, true)
        {
            Database.SetInitializer<TexteContext>(null);
            Database.CommandTimeout = 60;

            Configuration.LazyLoadingEnabled = false;
            Configuration.ProxyCreationEnabled = false;
        }

        public DbSet<ClienteEntity> Cliente { get; set; }
        public DbSet<ChamadoEntity> Chamado { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
            modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();
            modelBuilder.Conventions.Remove<ManyToManyCascadeDeleteConvention>();

            modelBuilder.Properties()
                .Where(p => p.Name == p.ReflectedType.Name + "Id")
                .Configure(p => p.IsKey());
        }
    }
}