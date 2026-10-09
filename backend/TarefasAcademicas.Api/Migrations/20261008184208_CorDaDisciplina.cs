using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TarefasAcademicas.Api.Migrations
{
    /// <inheritdoc />
    public partial class CorDaDisciplina : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "cor",
                table: "disciplina",
                type: "character varying(7)",
                maxLength: 7,
                nullable: false,
                defaultValue: "#1565c0");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "cor",
                table: "disciplina");
        }
    }
}
