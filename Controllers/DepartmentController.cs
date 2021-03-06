using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UVSITCU.Models.DTOs;
using UVSITCU.Models.Repositories;

namespace UVSITCU.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class DepartmentController : TController<Department>
  {
    public DepartmentController(IRepository<Department> repo) : base(repo) { }



  }
}
