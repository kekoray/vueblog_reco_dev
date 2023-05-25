---
title: spark
date: 2023-05-29
sidebar: auto  # 是否开启侧边栏
permalink: /test   # 永久链接：http://localhost:8080/test/
# keys:  
#  - '32位的 md5 加密密文'
---

# Spark



## Spark概述




### Spark组件

> Spark提供了批处理(RDDs), 结构化查询(DataFrame), 流计算(SparkStreaming), 机器学习(MLlib), 图计算(GraphX)等组件.
>
> ==Spark最核心的功能是RDDs==,RDDs存在于`spark-core`这个包内,这个包也是Spark最核心的包.

#### Spark-Core 和 弹性分布式数据集(RDDs)

* Spark-Core 是整个 Spark 的基础, 提供了分布式任务调度和基本的 I/O 功能
* Spark 的基础的程序抽象是弹性分布式数据集(RDDs), 是一个可以并行操作, 有容错的数据集合
  - RDDs 可以通过引用外部存储系统的数据集创建(如HDFS, HBase), 或者通过现有的 RDDs 转换得到
  - RDDs 抽象提供了 Java, Scala, Python 等语言的API
  - RDDs 简化了编程复杂性, 操作 RDDs 类似通过 Scala 或者 Java8 的 Streaming 操作本地数据集合

#### Spark SQL

- Spark SQL 在 `spark-core` 基础之上带出了一个名为 DataSet 和 DataFrame 的数据抽象化的概念
- Spark SQL 提供了在 Dataset 和 DataFrame 之上执行 SQL 的能力
- Spark SQL 提供了 DSL, 可以通过 Scala, Java, Python 等语言操作 DataSet 和 DataFrame
- 它还支持使用 JDBC/ODBC 服务器操作 SQL 语言

#### Spark Streaming

- Spark Streaming 充分利用 `spark-core` 的快速调度能力来运行流分析
- 它截取小批量的数据并可以对之运行 RDD Transformation
- 它提供了在同一个程序中同时使用流分析和批量分析的能力

#### MLlib

- MLlib 是 Spark 上分布式机器学习的框架. Spark分布式内存的架构 比 Hadoop磁盘式 的 Apache Mahout 快上 10 倍, 扩展性也非常优良
- MLlib 可以使用许多常见的机器学习和统计算法, 简化大规模机器学习
- 汇总统计, 相关性, 分层抽样, 假设检定, 随即数据生成
- 支持向量机, 回归, 线性回归, 逻辑回归, 决策树, 朴素贝叶斯
- 协同过滤, ALS
- K-means
- SVD奇异值分解, PCA主成分分析
- TF-IDF, Word2Vec, StandardScaler
- SGD随机梯度下降, L-BFGS

#### GraphX

- GraphX 是分布式图计算框架, 提供了一组可以表达图计算的 API, GraphX 还对这种抽象化提供了优化运行



### Spark和Hadoop的异同

|            | Hadoop                         | Spark                        |
| ---------- | ------------------------------ | ---------------------------- |
| **类型**   | 基础平台, 包含计算, 存储, 调度 | 分布式计算工具               |
| **场景**   | 大规模数据集上的批处理         | 迭代计算, 交互式计算, 流计算 |
| **延迟**   | 大                             | 小                           |
| **易用性** | API 较为底层, 算法适应性差     | API 较为顶层, 方便使用       |
| **价格**   | 对机器要求低, 便宜             | 对内存有要求, 相对较贵       |





### Spark集群结构

- ##### Master

  > 集群中的主节点, 负责总控, 调度, 管理和协调 Worker, 保留资源状况等

- ##### Driver
  
  > 该进程调用 Spark 程序的 main 方法, 并且启动 SparkContext.
  >
  > 在Spark中由SparkContext负责和ClusterManager通信，进行资源的申请、任务的分配和监控等；当Executor部分运行完毕后，Driver负责将SparkContext关闭。通常用SparkContext代表Drive.
  
- ##### Cluster Manager

  > 该进程负责和外部集群工具打交道, 申请或释放集群资源.
- ##### Worker / Slave

  > 该进程是一个守护进程, 负责启动和管理 Executor, 定期向 Master汇报
  
- ##### Executor

  > Application运行在Worker 节点上的一个进程，该进程负责运行Task，并且负责将数据存在内存或者磁盘上，每个Application都有各自独立的一批Executor

- **Application**

  > Appliction都是指用户编写的Spark应用程序，其中包括一个Driver功能的代码和分布在集群中多个节点上运行Executor代码

- **DAGScheduler**

  > 高级调度器 ; 根据Job构建基于Stage的DAG（有向无环图)，并提交Stage给TaskScheduler.

- **TaskScheduler**

  > 任务调度器 ; 将TaskSet提交给Executor运行.

- **Task**

  > 被送到某个Executor上的工作任务 ; 是Spark中最小的独立执行单元, 其作用是处理一个RDD分区;  

- **Job**

  > 程序调度运行的最大单位 , 调用Action算子的时候生成; 一个Application中往往会产生多个Job.

- **Stage**

  > 每个Job会被拆分成多组Task, 作为一个TaskSet, 也就是Stage; Stage的边界就是发生shuffle的地方.





## Spark入门

- ##### Spark官方提供了两种方式编写代码

  - ==**Spark shell**== 是Spark提供的一个基于Scala语言的交互式解释器,类似于Scala提供的交互式解释器,Sparkshell也可以直接在Shell中编写代码执行这种方式也比较重要,因为一般的数据分析任务可能需要探索着进行,不是一蹴而就的,使用Sparkshell先进行探索,当代码稳定以后,使用独立应用的方式来提交任务,这样是一个比较常见的流程.
  - ==**Spark submit**== 是一个独立应用的命令,用于提交Scala编写的基于Spark框架,这种提交方式常用作于在集群中运行任务.



### Spark shell的方式编写WordCount

#### Spark shell 简介

- ##### 启动 Spark shell

  - 进入 Spark 安装目录后执行 ==spark-shell --master==  就可以提交Spark 任务

- Spark shell 的原理是把每一行 Scala 代码编译成类, 最终交由 Spark 执行

- ##### Master地址的设置

| 地址              | 解释                                                         |
| :---------------- | :----------------------------------------------------------- |
| local[N]          | 使用N条Worker线程在本地运行                                  |
| spark://host:port | 在Spark standalone中运行,指定Spark集群的Master地址,端口默认为7077 |
| mesos://host:port | 在Apache Mesos中运行,指定Mesos的地址                         |
| yarn              | 在Yarn中运行,Yarn的地址由环境变量HADOOP_CONF_DIR来指定       |

#### 1. 实现WordCount的步骤

- ##### **Step 1** :  准备文件

```shell
#在node-1中创建文件
#vim wordcount.txt

hadoop spark flume
spark hadoop
flume hadoop
```

- ##### **Step 2** :  启动 Spark shell

```shell
#cd /export/servers/spark
bin/spark-shell --master local[2]
```

- ##### **Step 3** :  执行步骤

```scala
//1.读取文件
scala> val sourceRdd = sc.textFile("file:///root/wordcount.txt")
sourceRdd: org.apache.spark.rdd.RDD[String] = file:///export/data/wordcount.txt MapPartitionsRDD[1] at textFile at <console>:24

//2.拆分单词
scala> val flattenCountRdd = sourceRdd.flatMap(_.split(" ")).map((_, 1))
flattenCountRdd: org.apache.spark.rdd.RDD[(String, Int)] = MapPartitionsRDD[3] at map at <console>:26

//3.标识每个单词的词频
scala> val aggCountRdd = flattenCountRdd.reduceByKey(_ + _)
aggCountRdd: org.apache.spark.rdd.RDD[(String, Int)] = ShuffledRDD[4] at reduceByKey at <console>:28

//4.聚合计算词频
scala> val result = aggCountRdd.collect
result: Array[(String, Int)] = Array((spark,2), (hadoop,3), (flume,2))
```

#### 2. 运行流程分析

- ##### 上述代码中 ==sc 变量指的是SparkContext, 是Spark程序的上下文和入口.==

  - 正常情况下我们需要自己创建, 但是如果使用Spark shell的话, Spark shell会帮助我们创建, 并且以**变量sc的形式提供给我们调用.**

- ##### 业务处理步骤

1. `flatMap(_.split(" "))` 将数据转为数组的形式, 并展平为多个数据
2. `map_, 1` 将数据转换为元组的形式
3. `reduceByKey(_ + _)` 计算每个 Key 出现的次数



### 读取 HDFS 上的文件

>  Spark访问HDFS的两种方式

- #### Step 1 :  上传文件到 HDFS 中

  ```shell
  #cd /export/data
  hdfs dfs -mkdir /dataset
  hdfs dfs -put wordcount.txt /dataset/
  ```

- #### Step 2 :  在Spark shell中访问HDFS

  - ##### 方式1	 ----   ==**指定详细的node地址**==

    ```scala
    val sourceRdd = sc.textFile("hdfs://node-1:8020/dataset/wordcount.txt")
    val flattenCountRdd = sourceRdd.flatMap(_.split(" ")).map((_, 1))
    val aggCountRdd = flattenCountRdd.reduceByKey(_ + _)
    val result = aggCountRdd.collect
    ```

  - ##### 方式2	 ----   **通过向Spark配置Hadoop的路径, 可==直接写路径==**

    - 在 **spark-env.sh** 中添加Hadoop的配置路径  
      - ==**export HADOOP_CONF_DIR="/etc/hadoop/conf"**==

    ```scala
    //直接写路径
    val sourceRdd = sc.textFile("/dataset/wordcount.txt")
    
    //可指定HDFS
    val sourceRdd = sc.textFile("hdfs:///dataset/wordcount.txt")
    ```



### 编写独立应用提交Spark任务

#### spark-submit 简介

- ##### 语法	

  - **app jar **----程序Jar包
  - **app options -**---程序Main方法传入的参数
  - **options **----提交应用的参数,可以有如下选项

```shell
spark-submit [options] <app jar> <app options>
```

- ##### 配置spark-submit命令的环境变量

  ```shell
  #vim /etc/profile
  
  export SPARK_BIN=/export/servers/spark/bin
  export PATH=$PATH:$SPARK_BIN
  
  #source /etc/profile
  ```

- ##### 可选参数

| 参数              | 解释                                                         |
| ----------------- | ------------------------------------------------------------ |
| --master          | 同Spark shell的Master,可以是spark, yarn, mesos, kubernetes等URL |
| --deploy-mode     | Driver运行位置,可选Client和Cluster,分别对应运行在本地和集群(Worker)中 |
| --class           | Jar中的Class,程序入口                                        |
| --jars            | 依赖Jar包的位置                                              |
| --driver-memory   | Driver程序运行所需要的内存,默认512M                          |
| --executor-memory | Executor的内存大小,默认1G                                    |

#### Spark代码编写步骤

1. **创建SparkConf**     

2. **创建SparkContext**  

3. **创建RDD**  

4. **对RDD使用Transformations类算子进行数据转换**

5. **使用Action触发Transformations执行**

6. **关闭SparkContext**  

#### 1. 创建IDEA工程

```xml
 <properties>
        <scala.version>2.11.8</scala.version>
        <spark.version>2.2.0</spark.version>
        <slf4j.version>1.7.16</slf4j.version>
        <log4j.version>1.2.17</log4j.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.scala-lang</groupId>
            <artifactId>scala-library</artifactId>
            <version>${scala.version}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.spark</groupId>
            <artifactId>spark-core_2.11</artifactId>
            <version>${spark.version}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.hadoop</groupId>
            <artifactId>hadoop-client</artifactId>
            <version>2.6.0</version>
        </dependency>

        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>jcl-over-slf4j</artifactId>
            <version>${slf4j.version}</version>
        </dependency>
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-api</artifactId>
            <version>${slf4j.version}</version>
        </dependency>
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-log4j12</artifactId>
            <version>${slf4j.version}</version>
        </dependency>
        <dependency>
            <groupId>log4j</groupId>
            <artifactId>log4j</artifactId>
            <version>${log4j.version}</version>
        </dependency>

        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.10</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>

    <build>
        <sourceDirectory>src/main/scala</sourceDirectory>
        <testSourceDirectory>src/test/scala</testSourceDirectory>

        <plugins>

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.0</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                    <encoding>UTF-8</encoding>
                </configuration>
            </plugin>

            <plugin>
                <groupId>net.alchim31.maven</groupId>
                <artifactId>scala-maven-plugin</artifactId>
                <version>3.2.0</version>
                <executions>
                    <execution>
                        <goals>
                            <goal>compile</goal>
                            <goal>testCompile</goal>
                        </goals>
                        <configuration>
                            <args>
                                <arg>-dependencyfile</arg>
                                <arg>${project.build.directory}/.scala_dependencies</arg>
                            </args>
                        </configuration>
                    </execution>
                </executions>
            </plugin>

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-shade-plugin</artifactId>
                <version>3.1.1</version>
                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>shade</goal>
                        </goals>
                        <configuration>
                            <filters>
                                <filter>
                                    <artifact>*:*</artifact>
                                    <excludes>
                                        <exclude>META-INF/*.SF</exclude>
                                        <exclude>META-INF/*.DSA</exclude>
                                        <exclude>META-INF/*.RSA</exclude>
                                    </excludes>
                                </filter>
                            </filters>
                            <transformers>
                                <transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
                                    <mainClass></mainClass>
                                </transformer>
                            </transformers>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```

#### 2. 编写代码

```scala
object WordCounts {

  def main(args: Array[String]): Unit = {
      
    // 1. 创建 SparkConf
    val conf = new SparkConf().setMaster("local[2]")
    // 2. 创建 Spark Context
    val sc: SparkContext = new SparkContext(conf)

    // 3. 读取文件并计算词频
          //1.读取文件
        val source: RDD[String] = sc.textFile("hdfs://node01:8020/dataset/wordcount.txt", 2)
          //2.把整句话拆分为多个单词  
        val words: RDD[String] = source.flatMap { line => line.split(" ") }
          //3.把每个单词指定一个词频
        val wordsTuple: RDD[(String, Int)] = words.map { word => (word, 1) }
          //4.聚合
        val wordsCount: RDD[(String, Int)] = wordsTuple.reduceByKey { (x, y) => x + y }
    // 4. 查看执行结果
    wordsCount.foreach(println(_))
  }
}
```

#### 3. 运行
1. ##### **直接在IDEA中运行Spark程序**

2. ##### 打包提交集群中==使用spark-submit命令运行==

   - ##### 在 node-1中Jar包所在的目录执行如下命令	

```scala
spark-submit --master spark://node-1:7077 \
--class com.spark.demo_1.WordCounts \
sprak_demo1-1.0-SNAPSHOT.jar
```







## RDD概念



### 1. RDD是什么

- **概念 :**  ==RDD, 全称为Resilient Distributed Datasets, 是一个不可变、可分区、里面的元素可以并行计算的弹性分布式数据集。==

1. ##### RDD是数据集

2. ##### RDD是编程模型

3. ##### RDD相互之间有依赖关系

4. ##### RDD是可以分区的

   - RDD 之所以要设计为有分区的, 是**因为要进行分布式计算, 每个不同的分区可以在不同的线程, 或者进程, 甚至节点中, 从而做到并行计算.**

> 例如上图中, 使用了一个 RDD 表示 HDFS 上的某一个文件, 这个文件在 HDFS 中是分三块, 那么 RDD 在读取的时候就也有三个分区, 每个 RDD 的分区对应了一个 HDFS 的分块 . 后续 RDD 在计算的时候, 可以更改分区, 也可以保持三个分区, 每个分区之间有依赖关系, 例如说 RDD2 的分区一依赖了 RDD1 的分区.



### 2. 创建RDD

#### SparkContext

- ##### **SparkContext**是spark-core的入口组件,是一个Spark程序的入口,

- 在Driver中SparkContext是最主要的组件,也是Driver在运行时首先会创建的组件,是Driver的核心.

- ##### SparkContext主要作用 

  - 创建 RDD, 主要是通过读取文件创建 RDD
  - 监控和调度任务, 包含了一系列组件, 例如 DAGScheduler, TaskSheduler,累加器,广播变量

```scala
//1.创建 SparkConf
val conf = new SparkConf().setAppName("spark_context").setMaster("local[6]")
//2.创建 SparkContext
val sc = new SparkContext(conf)
//3.关闭 SparkContext, 释放集群资源
sc.stop()
```

#### RDD三种创建方式

- ##### RDD可以通过本地集合直接创建

  - 通过 ==**parallelize**== 和 ==**makeRDD**== 这两个API创建RDD, 第一个参数是**本地集合**, 第二个参数是**分区数**

```scala
  def rddCreationLocal(): Unit = {
    val conf = new SparkConf().setMaster("local[6]").setAppName("spark_context")
    val sc = new SparkContext(conf)
      
    //定义Seq集合,可与list互转
    val seq: Seq[Int] = Seq(1, 2, 3)
      
    //parallelize方式
    val rdd1: RDD[Int] = sc.parallelize(seq, 2)
    sc.parallelize(seq)
      
    //makeRDD方式
    val rdd2: RDD[Int] = sc.makeRDD(seq, 2)
  }
```

- ##### RDD也可以通过读取外部数据集来创建   ----  ==常用==

  - ##### 访问方式

    1. 访问**本地文件**,  sc.textFile("==file:///  …==")
    2. 支持访问文件夹, 例如  sc.textFile("==hdfs://node-1:8020/dataset==")
    3. 支持访问压缩文件, 例如  sc.textFile("==hdfs://node-1:8020/dataset/words.gz==")
    4. 支持通过通配符访问, 例如  sc.textFile("==hdfs:///dataset/*.txt==")

```scala
  def rddCreationFiles(): Unit = {
    val conf = new SparkConf().setAppName("spark_context").setMaster("local[6]")
    val sc = new SparkContext(conf)
      
	//访问本地文件
    sc.textFile("file:///E:/RDDdemo/dataset/WordCount.txt")
      
    //  访问hdfs文件
    sc.textFile("hdfs://node-1:8020/...")      
  }
```

- ##### RDD也可以通过其它的RDD衍生而来

```scala
  def rddCreateFromRDD(): Unit = {
    val conf = new SparkConf().setMaster("local[6]").setAppName("spark_context")
    val sc = new SparkContext(conf)

    //通过本地集合直接创建rdd
    val rdd1 = sc.parallelize(Seq(1, 2, 3))
      
    // 通过在rdd上执行算子操作, 会生成新的rdd
    val rdd2: RDD[Int] = rdd1.map(item => item)
  }
```



### 3. RDD算子

#### Map 算子

> 把 RDD 中的数据 一对一 的转为另一种形式

- ##### 语法

  - 是`原RDD` → `新RDD` 的过程, 这个函数的参数是原RDD数据, 返回值是经过函数转换的新RDD的数据

```scala
def map[U: ClassTag](f: T ⇒ U): RDD[U]
```

![c59d44296918b864a975ebbeb60d4c04](Spark.assets/c59d44296918b864a975ebbeb60d4c04.png)

- ##### 示例

```scala
sc.parallelize(Seq(1, 2, 3))
  .map( num => num * 10 )
  .collect()
```



#### FlatMap算子

> flatMap 其实是两个操作, 是 **map + flatten,** 也就是先转换, 后把转换而来的 List 展开



- ##### 语法

  - 参数是原RDD数据, 返回值是经过函数转换的新RDD的数据

```scala
def flatMap[U: ClassTag](f: T ⇒ List[U]): RDD[U]
```

![f6c4feba14bb71372aa0cb678067c6a8](Spark.assets/f6c4feba14bb71372aa0cb678067c6a8.png)

- ##### 示例

```scala
sc.parallelize(Seq("Hello lily", "Hello lucy", "Hello tim"))
  .flatMap( line => line.split(" ") )
  .collect()
```



#### ReduceByKey算子

> 首先按照 Key 分组, 接下来把整组的Value计算出一个聚合值, 这个操作非常类似于MapReduce 中的Reduce



- ##### 语法

  - func → 执行数据处理的函数, 传入两个参数, 一个是当前值, 一个是局部汇总 ; 这个函数需要有一个输出, 输出就是这个Key的汇总结果

```scala
def reduceByKey(func: (V, V) ⇒ V): RDD[(K, V)]
```

![07678e1b4d6ba1dfaf2f5df89489def4](Spark.assets/07678e1b4d6ba1dfaf2f5df89489def4.png)

- ##### 示例

```scala
sc.parallelize(Seq(("a", 1), ("a", 1), ("b", 1)))
  .reduceByKey( (curr, agg) => curr + agg )
  .collect()
```





## RDD算子



### 1. RDD算子分类和特点

- ##### RDD算子从功能上分为两大类

  1. ==**Transformation**(转换操作)== :   它会在一个已存在的RDD上创建一个新RDD,将旧RDD的数据转换为另外一种形式后放入新的RDD.
  2. ==**Action**(动作操作)== :  执行各个分区的计算任务,将得到的结果返回到Driver中.

- ##### RDD算子特点
  - Transformations是Lazy(惰性)的 , 在执行到转换操作的时候, 并不会立刻执行, 直到遇见了Action操作, 才会触发真正的执行, 这个特点叫做 **惰性求值**.
  - 默认情况下,每一个Action运行的时候,其所关联的所有Transformation RDD都会重新计算,但是也可以使用presist 方法将RDD持久化到磁盘或者内存中.这个时候为了下次可以更快的访问, 会把数据保存到集群上.

- ##### RDD数据类型分类

  - **字符串 :** 针对基础类型(例如 String)处理的普通算子
  - **键值对 :** 针对 (Key-Value ) 数据处理的byKey算子
  - **数字型 :** 针对数字类型数据处理的计算算子



### 2. Transformations 算子

#### Map--转换操作

> 把RDD中的==**每一条数据**==中的每个元素一对一的转为另一种形式

- ##### 语法

```scala
def map[U: ClassTag](f: T => U)
```

- ##### 示例

```scala
sc.parallelize(Seq(1, 2, 3))
  .map( num => num * 10 )
  .collect()
```



#### MapValues--转换操作

> MapValues只能作用于Key-Value型数据, **==mapValue作用于Value==**.

- ##### 语法

```scala
def mapValues[U](f: V => U)
```

- ##### 示例

```scala
sc.parallelize(Seq(("a", 1), ("b", 2), ("c", 3)))
  .mapValues( item => item * 10 )
  .collect()
  .foreach(println(_))
```



#### MapPartitions--转换操作

> map是针对**==每一条数据中的每个元素==** 进行转换, 
>
> mapPartitions针对==**整个分区中的每一条数据**== 进行转换

- ##### 语法

  - func参数是一个集合(一个分区整个所有的数据) , 返回值也是一个集合.

```scala
def mapPartitions[U: ClassTag](
        f: Iterator[T] => Iterator[U],
        preservesPartitioning: Boolean = false)
```

- ##### 示例

```scala
sc.parallelize(Seq(1, 2, 3, 4, 5, 6), 2)
  .mapPartitions(iter => {
    // 遍历iter其中每一条数据进行转换, 转换完成以后, 返回这个iter
    // iter是scala中的集合类型
    iter.map(item => item * 10)
  })
  .collect()
  .foreach(item => println(item))


/**
  * RDD["我","是","中","国","人","啊"]
  * RDD["{我}","{是}","{中}","{国}","{人}","{啊}"]
  */
@Test
def mapPartitionFunction2(): Unit ={
  val rdd: RDD[String] = sc.parallelize("我 是 中 国 人 啊".split(" "),2)
  rdd.mapPartitions(iter => {
    // iter是scala中的集合类型
    iter.map(x => x.mkString("{",",","}"))
  }).collect().foreach(println)
}
```

- #### 实际开发用法  --  连接数据库

> ##### 连接数据库的操作必须放到算子内部才能正确的被Executor执行, 那mapPartitions就显示比map要有优势.
>
> - ##### 一个分区只要连接一次数据库

```scala
  rdd.mapPartitions(x => {
      new Iterator[Any] {
        override def hasNext: Boolean = {
          if (x.hasNext) {
            true
          } else {
            println("关闭数据库")
            false
          }
        }
        
        override def next(): Any = "写入数据" + x.next()
      }
    })
```



#### MapPartitionsWithIndex--转换操作

> 和mapPartitions的区别是func中多了一个**分区号的参数**, ==**用于获取每个分区的数据**==.

- ##### 语法

```scala
def mapPartitionsWithIndex[U: ClassTag](
        f: (Int, Iterator[T]) => Iterator[U],
        preservesPartitioning: Boolean = false)
```

- ##### 示例

```scala
sc.parallelize(Seq(1, 2, 3, 4, 5, 6, 7, 8), 3)
  .mapPartitionsWithIndex((index, iter) => {
    println(s"index : ${index}  ---  ${iter.mkString(":")}")
    iter
  }).collect()
```



#### FlatMap--转换操作

> 返回的是经过函数转换成的新RDD集合

- ##### 语法

```scala
def flatMap[U: ClassTag](f: T ⇒ List[U]): RDD[U]
```

- ##### 示例

```scala
sc.parallelize(Seq("Hello lily", "Hello lucy", "Hello tim"))
  .flatMap( line => line.split(" ") )
  .collect()
```



#### Filter--过滤操作

> 可以过滤掉数据集中一部分元素 

- ##### 语法

  - **ture,**    当前元素就会被加入新数据集
  - **flase,**   当前元素会被过滤掉

```scala
def filter(f: T => Boolean)
```

- ##### 示例

```scala
sc.parallelize(Seq(1, 2, 3, 4, 5, 6, 7, 8, 9, 10))
  .filter(item => item % 2 == 0)
  .collect()
  .foreach(item => println(item))
```



#### Sample--过滤操作

> 从一个数据集中抽样出来一部分, 常用作于把大数据集变小, 尽可能的减少数据集规律的损失.

- ##### 语法

  - **withReplacement**  :  意为是否取样以后是否还放回原数据集供下次使用
  - **fraction**  :  意为抽样的比例
  - **seed**   :  随机数种子, 用于Sample内部随机生成下标, 一般不指定, 使用默认值.

```scala
def sample(
      withReplacement: Boolean,
      fraction: Double,
      seed: Long = Utils.random.nextLong)
```

- ##### 示例

```scala
sc.parallelize(Seq(1, 2, 3, 4, 5, 6, 7, 8, 9, 10))
  .sample(withReplacement = true, 0.6)
  .collect().foreach(item => println(item))
```



#### Union--集合操作

> 并集

- ##### 语法

```scala
def union(other: RDD[T])
```

- ##### 示例

```scala
val rdd1 = sc.parallelize(Seq(1, 2, 3, 4, 5))
val rdd2 = sc.parallelize(Seq(3, 4, 5, 6, 7))
rdd1.union(rdd2)
  .collect()
  .foreach(println(_))
```



#### Intersection--集合操作

> 交集

- ##### 语法

```scala
def intersection(other: RDD[T])
```

- ##### 示例

```scala
val rdd1 = sc.parallelize(Seq(1, 2, 3, 4, 5))
val rdd2 = sc.parallelize(Seq(3, 4, 5, 6, 7))
rdd1.intersection(rdd2)
  .collect()
  .foreach(println(_))
```



#### Subtract--集合操作

> 差集

- ##### 语法

```scala
def subtract(other: RDD[T])
```

- ##### 示例

```scala
val rdd1 = sc.parallelize(Seq(1, 2, 3, 4, 5))
val rdd2 = sc.parallelize(Seq(3, 4, 5, 6, 7))
rdd1.subtract(rdd2)
  .collect()
  .foreach(println(_))
```



#### Distinct--集合操作

> Distinct 算子用于去重
>
> 本质上 Distinct 就是一个reductByKey, 把重复的合并为一个

- ##### 语法

```scala
def distinct()
```

- ##### 示例

```scala
sc.parallelize(Seq(1, 1, 2, 2, 3))
  .distinct()
  .collect()
```



#### Join--集合操作

> 将两个RDD按照==相同的Key进行内连接==, 结果是一个笛卡尔积形式.

- ##### 语法

```scala
def join[W](other: RDD[(K, W)]): RDD[(K, (V, W))]
```

- ##### 示例

```scala
val rdd1 = sc.parallelize(Seq(("a", 1), ("a", 2), ("b", 1)))
val rdd2 = sc.parallelize(Seq(("a", 10), ("a", 11), ("a", 12)))
rdd1.join(rdd2)
  .collect()
  .foreach(println(_))
```



#### ReduceByKey--聚合操作

> 首先按照Key分组, 接下来把**==每组的Value计算出一个聚合值==**, 这个操作非常类似于MapReduce中的Reduce.
>
> ReduceByKey只能作用于Key-Value型数据(Tuple2) .
>
> ReduceByKey在Map端有一个Cominer, 这样 I/O 的数据便会减少.

- ##### 语法

```scala
def reduceByKey(func: (V, V) ⇒ V)
```

- ##### 示例

```scala
sc.parallelize(Seq(("a", 1), ("a", 1), ("b", 1)))
  .reduceByKey( (curr, agg) => curr + agg )
  .collect()
```



#### GroupByKey--聚合操作

> 作用是按照Key分组,和ReduceByKey类似,但是GroupByKey并不求聚合,只是**==列举Key对应的所有Value==**

- 语法

```scala
def groupByKey(): RDD[(K, Iterable[V])]
```

- ##### 示例

```scala
sc.parallelize(Seq(("a", 1), ("a", 1), ("b", 1)))
      .groupByKey()
      .collect()
      .foreach(println(_))
```



#### CombineByKey--聚合操作

> 对数据集按照Key分组进行 ==Value的聚合计算==
>
> groupByKey , reduceByKey 的底层都是 combineByKey.

- ##### 语法

  - **createCombiner**  :  ==将Value进行初步转换==
  - **mergeValue** :   在每个分区把上一步转换的结果聚合计算
  - **mergeCombiners**  :  在所有分区上把每个分区的聚合结果聚合
  - **partitioner**  :  可选, 分区函数
  - **mapSideCombiner**  :  可选, 是否在Map端Combine
  - **serializer**  :  序列化器

```scala
def combineByKey[C](createCombiner: V => C,
                    mergeValue: (C, V) => C,
                    mergeCombiners: (C, C) => C,
                    partitioner: Partitioner,
                    mapSideCombine: Boolean = true,
                    serializer: Serializer = null)
```

- ##### 示例

> 需求 :   **求平均值**

- 方式1

```scala
def combineByKey(): Unit = {
    
    // 1. 准备集合
    val rdd: RDD[(String, Double)] = sc.parallelize(Seq(
      ("zhangsan", 99.0),
      ("zhangsan", 96.0),
      ("lisi", 97.0),
      ("lisi", 98.0),
      ("zhangsan", 97.0)))
      
    // 2. 算子操作
    
    //type用于封装数据类型为(Double, Int)在变量RDDType里
    type RDDType = (Double, Int)
    
    val combineResult = rdd.combineByKey(
      createCombiner = (curr: Double) => (curr, 1),
      mergeValue = (curr: RDDType, nextValue: Double) => (curr._1 + nextValue, curr._2 + 1),
      mergeCombiners = (curr: RDDType, agg: RDDType) => (curr._1 + agg._1, curr._2 + agg._2)
    )
    
    // (zhangsan,(292.0,3))   (lisi,(195.0,2))
    val resultRDD = combineResult.map(item => (item._1, item._2._1 / item._2._2))

    // 3. 获取结果, 打印结果
    resultRDD.collect().foreach(println(_))
  }
```

- 方式2

```scala
/**
  * 利用groupbykey实现求平均分
  */
@Test
def combineByKey2(): Unit = {
  // 1. 准备集合
  val rdd: RDD[(String, Double)] = sc.parallelize(Seq(
    ("zhangsan", 99.0),
    ("zhangsan", 96.0),
    ("lisi", 97.0),
    ("lisi", 98.0),
    ("zhangsan", 97.0))
  )

   rdd.groupByKey()
      .map(x => {
        x._1 -> x._2.sum / x._2.size
      }).collectAsMap().foreach(println)
}
```



#### AggregateByKey--聚合操作 

> 应用场景 :  **aggregateByKey 特别适合针对每个数据要先处理, 后聚合.**
>
> - 与reduceByKey的区别
>   - aggregateByKey 最终聚合结果的类型和传入的初始值类型保持一致
>   - reduceByKey 在集合中选取第一个值作为初始值, 并且聚合过的数据类型不能改变

- ##### 语法

  - **zeroValue** :   ==指定初始值==
  - **seqOp : (初始值, value)** :     ==每一个元素的value与初始值进行计算.==   
  - **combOp : (value, agg)** :      将seqOp的结果进行同key分组, ==聚合计算整组的value.==

```scala
def aggregateByKey[U: ClassTag](zeroValue: U)
					(seqOp: (U, V) => U,combOp: (U, U) => U)
```

- ##### 示例

```scala
val rdd = sc.parallelize(Seq(("手机", 10.0), ("手机", 15.0), ("电脑", 20.0)))
val result = rdd.aggregateByKey(0.8)(
  seqOp = (zero, price) => price * zero,
  combOp = (curr, agg) => curr + agg
).collect()
println(result)
```



#### foldByKey--聚合操作

> 首先按照Key分组, 然后**==聚合计算整组的value==**, 和**reduceByKey**的区别是可以**==指定初始值==**.
>
> foldByKey和 Scala中的fold区别是, 
>
> - **fold**的==**初始值作用于整体的数据**==
>
> ```scala
> scala> Seq(1,2,3).fold(10)(_+_)
> res6: Int = 16
> ```
>
> - **foldByKey**的**==初始值作用于每一个数据元素==**

- ##### 语法

  - **zeroValue** :  **初始值**
  - **func**  :  **==聚合计算整组的value==**

```scala
def foldByKey(zeroValue: V)(func: (V, V) => V) 
```

- ##### 示例

```scala
sc.parallelize(Seq(("a", 1), ("a", 1), ("b", 1)))
  .foldByKey(10)((curr, agg) => curr + agg)
  .collect()
  .foreach(println(_))
```



#### SortBy--排序操作

> 排序相关的算子有两个, 一个是**==sortBy==**, 另外一个是**==sortByKey==**

- ##### 语法

  - ##### sortBy适用于==任何类型==RDD,  **sortByKey==只适用于KV类型==RDD.**

  - ##### sortBy可以按照==指定的任何部分==来排序, sortByKey==只能按照Key==来排序

```scala
def sortBy[K](f: (T) => K,
              ascending: Boolean = true,  //是否升序
              numPartitions: Int = this.partitions.length)


def sortByKey(ascending: Boolean = true, 
              numPartitions: Int = self.partitions.length)
```

- ##### 示例

```scala
  def sort(): Unit = {
    val rddlist = sc.parallelize(Seq(2, 4, 1, 5, 1, 8))
    val rddmap = sc.parallelize(Seq(("a", 1), ("b", 3), ("c", 2)))

    //sortBy适用于任何类型RDD
    rddlist.sortBy(item => item)

    //sortBy正序排序
    rddmap.sortBy(item => item._2)
    //sortBy降序排序
    rddmap.sortBy(item => item._2,false)

    //sortByKey按照key排序
    rddmap.sortByKey()
    //sortByKey按照value排序
    rddmap.map(item => (item._2, item._1)).sortByKey().map(item => (item._2, item._1)).collect().foreach(println(_))
  }
```



#### Coalesce--重分区操作

> coalesce ==减少分区数== ; 进行重分区的时候, 默认是不Shuffle的, coalesce默认不能增大分区数.
>
> 设置参数为true时, 即可增加分区数.

- ##### 语法

```scala
def coalesce(numPartitions: Int, shuffle: Boolean = false,
               partitionCoalescer: Option[PartitionCoalescer]
```

- ##### 示例

```scala
val rdd = sc.parallelize(Seq(1, 2, 3, 4, 5), 2)
//减少分区数
println(rdd.coalesce(1, shuffle = false).partitions.size)
//增加分区数
println(rdd.coalesce(5, shuffle = true).partitions.size)
```



#### Repartition--重分区操作

> repartition ==重新指定分区数== ; 进行重分区的时候, 默认是Shuffle的.

- ##### 语法

```scala
def repartition(numPartitions: Int) 
```

- ##### 示例

```scala
val rdd = sc.parallelize(Seq(1, 2, 3, 4, 5), 2)
// repartition
println(rdd.repartition(5).partitions.size)
```



#### Cogroup--聚合操作

> 多个 RDD 协同分组, 将多个 RDD 中 Key 相同的 Value 分组.

- ##### 语法

```scala
def cogroup[W1, W2, W3](other1: RDD[(K, W1)],
      other2: RDD[(K, W2)],
      other3: RDD[(K, W3)],
      partitioner: Partitioner)
      : RDD[(K, (Iterable[V], Iterable[W1], Iterable[W2], Iterable[W3]))]
```

- ##### 示例

```scala
val rdd1 = sc.parallelize(Seq(("a", 1), ("a", 2), ("a", 5), ("b", 2), ("b", 6), ("c", 3), ("d", 2)))
val rdd2 = sc.parallelize(Seq(("a", 10), ("b", 1), ("d", 3)))
val rdd3 = sc.parallelize(Seq(("b", 10), ("a", 1)))

val result1 = rdd1.cogroup(rdd2).collect()
val result2 = rdd1.cogroup(rdd2, rdd3).collect()

/*
执行结果:
Array(
  (d,(CompactBuffer(2),CompactBuffer(3))),
  (a,(CompactBuffer(1, 2, 5),CompactBuffer(10))),
  (b,(CompactBuffer(2, 6),CompactBuffer(1))),
  (c,(CompactBuffer(3),CompactBuffer()))
)
 */
println(result1)

/*
执行结果:
Array(
  (d,(CompactBuffer(2),CompactBuffer(3),CompactBuffer())),
  (a,(CompactBuffer(1, 2, 5),CompactBuffer(10),CompactBuffer(1))),
  (b,(CompactBuffer(2, 6),CompactBuffer(1),Co...
 */
println(result2)
```



### 3. Action 算子



#### Reduce

> ##### 对整个结果集规约, ==最终生成一条数据==, 是整个数据集的汇总.

- ##### Reduce和ReduceByKey的区别

  - reduce是action的算子, 并不是Shuffled操作 ; reduceByKey是转换算子
  - reduce适用于**任何类型**的数据, reduceByKey只适用于**KV类型**数据.
  - reduce针对的是整个数据集进行聚合, 故只会**生成1条结果**
  - reduceByKey是按照key分组,然后聚合每组value,故会**生成多条结果**

- ##### 语法

```scala
def reduce(f: (T, T) => T): T
```

- ##### 示例

```scala
def reduce(): Unit = {
  val rdd = sc.parallelize(Seq(("手机", 10.0), ("手机", 15.0), ("电脑", 20.0)))
  val result: (String, Double) = rdd.reduce((curr, agg) => ("总价", curr._2 + agg._2) )
  println(result)
}
```



#### collect

> ##### 以==数组的形式==返回数据集中==所有元素==.

- ##### 语法

```scala
//返回的是Array类型
def collect(): Array[T]


//返回的是Map类型
def collectAsMap(): Map[K, V]
```

- ##### 示例

```scala
//返回的是Array类型
val rdd = sc.parallelize(Seq(1, 2, 3))
rdd.collect().foreach(println(_))


//返回的是Map类型
val rdd = sc.parallelize(Seq(("a", 1), ("a", 2), ("c", 3), ("c", 4)))
rdd.collectAsMap().foreach(println(_))
```



#### foreach

> #####  ==无序遍历整个数据集中每一个元素==, 由于是并行执行,所以是无序的.

- ##### 语法

```scala
def foreach(f: T => Unit)
```

- ##### 示例

```scala
val rdd = sc.parallelize(Seq(1, 2, 3))

//1.无序遍历
rdd.foreach(println(_))

//2.有序的遍历
rdd.collect().foreach(println(_))
```



#### count

> ##### 求得整个数据集的==元素总个数==.

- ##### 语法

```scala
def count(): Long
```

- ##### 示例

```scala
val rdd = sc.parallelize(Seq(("a", 1), ("a", 2), ("c", 3), ("c", 4)))
println(rdd.count())	//4
```



#### countByKey

> ##### 求得整个数据集中==Key以及对应Key出现的次数==. 返回值为 ==Map(Key , count(Key))==
>
> ##### 如果要==解决数据倾斜==的问题, 是要先知道谁倾斜, 通过countByKey可以查看Key对应的数据总数, 从而解决倾斜问题

- ##### 语法

```scala
def countByKey(): Map[K, Long]
```

- ##### 示例

```scala
val rdd = sc.parallelize(Seq(("a", 1), ("a", 2), ("c", 3), ("c", 4)))
println(rdd.countByKey())	//Map(a -> 2, c -> 2)
```



#### first

> ##### first只是==获取第一个元素==, 所以first==只会处理第一个分区==, 所以速度很快, 无序处理所有数据

- ##### 语法

```scala
def first(): T
```

- ##### 示例

```scala
val rdd = sc.parallelize(Seq(1, 2, 3, 4, 5, 6))
println(rdd.first())	//1
```



#### take 

> ##### 返回整个数据集中==前 N 个元素==
>
> ==**取Top-N的数据** ----  sortBy+take(N)==

- ##### 语法

```scala
def take(num: Int): Array[T]
```

- ##### 示例

```scala
val rdd = sc.parallelize(Seq(1, 2, 3, 4, 5, 6))
rdd.take(3).foreach(item => println(item))
// 1 2 3 
```



#### takeSample 

> ##### 类似于sample, 区别在这是一个Action, 也是==采样获取数据==, 并直接返回结果.

- ##### 语法

  - **num**  :  指拿出元素个数

```scala
def takeSample(
      withReplacement: Boolean,
      num: Int,
      seed: Long = Utils.random.nextLong): Array[T]
```

- ##### 示例

```scala
val rdd = sc.parallelize(Seq(1, 2, 3, 4, 5, 6))
rdd.takeSample(withReplacement = false, num = 3).foreach(item => println(item))
//3 5 6
```



### 4. RDD对不同类型数据的支持

#### RDD数据类型分类

- **字符串 :** 对于字符串类型是比较基础的一些的操作, 诸如 map, flatMap, filter 等基础的算子.
- **键值对 :** 对于键值对类型的数据, 有额外的支持, 诸如 reduceByKey, groupByKey 等 byKey 的算子.
- **数字型 :** 对于数字型的数据也有额外的支持, 诸如 max, min 等.

#### RDD 对键值对数据的额外支持

> ##### 键值型数据本质上就是一个二元元组, 键值对类型的RDD表示为 RDD[(K, V)]
>
> > ##### RDD对键值对的额外支持是通过隐式支持来完成的, 一个RDD[(K, V)]可以被隐式转换为一个 PairRDDFunctions 对象, 从而调用其中的方法.

- ##### ==PairRDDFunctions==类中的方法

| 类别     | 算子             |
| :------- | :--------------- |
| 聚合操作 | reduceByKey    |
|          | foldByKey      |
|          | combineByKey   |
| 分组操作 | cogroup        |
|          | groupByKey       |
| 连接操作 | join           |
|          | leftOuterJoin  |
|          | rightOuterJoin |
| 排序操作 | sortBy         |
|          | sortByKey      |
| Action   | countByKey       |
|          | take             |
|          | collect          |

#### RDD 对数字型数据的额外支持

> ##### 对于数字型数据的额外支持基本上都是 ==Action 操作==, 而不是转换操作.

| 算子           | 含义             |
| :------------- | :--------------- |
| count          | 个数             |
| mean         | 均值             |
| sum            | 求和             |
| max         | 最大值           |
| min            | 最小值           |
| variance       | 方差             |
| sampleVariance | 从采样中计算方差 |
| stdev          | 标准差           |
| sampleStdev    | 采样的标准差     |





## RDD缓存

- ##### 案例

> 需求: 在日志文件中找到访问次数最少的 IP 和访问次数最多的 IP

```scala
def prepare(): Unit = {
    // 1. 创建 SC
    val conf = new SparkConf().setAppName("cache_prepare").setMaster("local[6]")
    val sc = new SparkContext(conf)

    // 2. 读取文件
    val source = sc.textFile("dataset/access_log_sample.txt")

    // 3. 取出IP, 赋予初始频率
    val countRDD = source.map( item => (item.split(" ")(0), 1) )

    // 4. 数据清洗
    val cleanRDD = countRDD.filter( item => StringUtils.isNotEmpty(item._1) )

    // 5. 统计IP出现的次数(聚合)
    val aggRDD = cleanRDD.reduceByKey( (curr, agg) => curr + agg )

    // 6. 统计出现次数最少的IP(得出结论)
    val lessIp = aggRDD.sortBy(item => item._2, ascending = true).first()

    // 7. 统计出现次数最多的IP(得出结论)
    val moreIp = aggRDD.sortBy(item => item._2, ascending = false).first()

    println((lessIp, moreIp))
  }
```

### 缓存的意义

> ##### 缓存能够帮助开发者在进行一些昂贵操作后, 将其结果保存下来, 以便下次使用无需再次执行, 缓存能够显著的提升性能.

- ##### 1. 减少shuffle操作

> ##### 一个rdd被使用多次时,会触发多个job运行, 使用缓存可以提升性能,减少shuffle操作.

- ##### 2. 解决容错问题

> ##### 避免后续的rdd出现异常,重新计算

### 缓存API

#### 1. 使用cache方法进行缓存

- ##### 语法

> cache 方法其实是 persist 方法的一个别名

```scala
def cache(): this.type = persist()
```

- ##### 示例

```scala
val RDD = aggRDD.cache( )
```

#### 2. 使用persist方法进行缓存

- ##### 语法

  - **StorageLevel**  :  缓存的级别

```scala
//方式1
def persist(): this.type = persist(StorageLevel.MEMORY_ONLY)

//方式2
def persist(newLevel: StorageLevel): this.type
```

- ##### 示例

```scala
val RDD = aggRDD.persist( )
val RDD = aggRDD.persist(StorageLevel.MEMORY_ONLY)
```

### 缓存级别

- #### 查看缓存级别

```scala
def getStorageLevel: StorageLevel = storageLevel
```

- ####  清理缓存

> ##### 指定删除RDD对应的缓存信息, 并指定缓存级别为NONE.

```scala
def unpersist(blocking: Boolean = true): this.type
```

- #### 分区级别选择
  - ##### **一般情况下默认存储级别** ==MEMORY_ONLY==  即可.

  - 若数据量过大的情况, 可以选择级别为 MEMORY_ONLY_SER .

  - 若数据量大且数据昂贵的情况, 可以选择级别为  MEMORY_AND_DISK .

  - 若需要快速故障恢复, 可以选择复制的存储级别.

> > 是否以反序列化形式存储; 
> > - 如果是true,存储的是对象; 
> > - 如果false, 则储存的是序列化过后的值(二进制的数据).
>
> SER : 表示以二进制数据来储存

| 缓存级别                | userDisk 是否使用磁盘 | `useMemory` 是否使用内存 | useOffHeap 是否使用堆外内存 | deserialized 是否以反序列化形式存储 | `replication` 副本数 |
| :---------------------- | :-------------------- | :----------------------- | :-------------------------- | :---------------------------------- | :------------------- |
| `NONE`                  | false                 | false                    | false                       | false                               | 1                    |
| `DISK_ONLY`             | true                  | false                    | false                       | false                               | 1                    |
| `DISK_ONLY_2`           | true                  | false                    | false                       | false                               | 2                    |
| `MEMORY_ONLY`           | false                 | true                     | false                       | true                                | 1                    |
| `MEMORY_ONLY_2`         | false                 | true                     | false                       | true                                | 2                    |
| MEMORY_ONLY_SER         | false                 | true                     | false                       | false                               | 1                    |
| `MEMORY_ONLY_SER_2`     | false                 | true                     | false                       | false                               | 2                    |
| `MEMORY_AND_DISK`       | true                  | true                     | false                       | true                                | 1                    |
| `MEMORY_AND_DISK`       | true                  | true                     | false                       | true                                | 2                    |
| `MEMORY_AND_DISK_SER`   | true                  | true                     | false                       | false                               | 1                    |
| `MEMORY_AND_DISK_SER_2` | true                  | true                     | false                       | false                               | 2                    |
| OFF_HEAP                | true                  | true                     | true                        | false                               | 1                    |





## Checkpoint



### Checkpoint的作用

- ##### Checkpoint的主要作用是斩断RDD的依赖链, 并且将数据存储在可靠的存储引擎中.

### Checkpoint的方式

- **可靠的**  ----   将数据存储在可靠的存储引擎中, 例如 ==HDFS==
- **本地的**  ----   将数据存储在==本地==

### Checkpoint和Cache的区别

> - **Cache** 可以把RDD计算出来然后放在内存中,但是 RDD 的依赖链是不能丢掉的,因为这种缓存是不可靠的,如果出现了一些错误,这个RDD的容错就只能通过回溯依赖链,重新计算出来.
> - **Checkpoint** 把结果保存在HDFS这类存储中,就是可靠的了,所以可以斩断依赖,如果出错了,则通过复制 HDFS 中的文件来实现容错.

1. Checkpoint 可以**保存数据到HDFS这类可靠的存储**上, Persist和 Cache只能**保存在本地的磁盘和内存**中.
2. Checkpoint 可以斩断RDD的依赖链,而Persist和Cache不行.
3. 因为CheckpointRDD没有向上的依赖链,所以程序结束后依然存在,不会被删除. 而Cache和Persist会在程序结束后立刻被清除.

### Checkpoint的使用

- ##### 语法

```scala
def checkpoint( ): Unit
```

- ##### 实现步骤

  1. ==**设置Checkpoint的存储路径**.==

  2. ##### ==**先开启Cache** , 再开启Checkpoint==

     > checkpoint会重新计算整个RDD的数据然后再存入HDFS等地方; 开启cache可以提高性能.

- ##### 代码实现

```scala
def checkpoint(): Unit = {
    val conf = new SparkConf().setAppName("cache_prepare").setMaster("local[6]")
    val sc = new SparkContext(conf)
    // 设置保存 checkpoint 的目录, 也可以设置为 HDFS 上的目录
    sc.setCheckpointDir("checkpoint")

    val source = sc.textFile("dataset/access_log_sample.txt")
    val countRDD = source.map( item => (item.split(" ")(0), 1) )
    val cleanRDD = countRDD.filter( item => StringUtils.isNotEmpty(item._1) )
    var aggRDD = cleanRDD.reduceByKey( (curr, agg) => curr + agg )

    // 如果调用 checkpoint, 则会重新计算一下 RDD, 然后把结果存在 HDFS 或者本地目录中
    // 所以,应该在 Checkpoint 之前, 进行一次 Cache
    aggRDD = aggRDD.cache()
    aggRDD.checkpoint()

    val lessIp = aggRDD.sortBy(item => item._2, ascending = true).first()
    val moreIp = aggRDD.sortBy(item => item._2, ascending = false).first()
    println((lessIp, moreIp))
  }
```





## Spark分布式共享变量

> ##### 跨机器(作用域)访问变量.
>
> 两种共享变量：**广播变量**（broadcast variable）与 **累加器**（accumulator）
>
> 累加器用来对**信息进行聚合**，而广播变量用来**高效分发较大的对象**

### spark闭包分发

**闭包**

> ##### **概念** :  ==一个函数携带了一个外包的作用域, 这种函数我们称之为叫做闭包==.  在Scala中的闭包本质上就是一个对象, 是 FunctionX 的实例.

- **Worker上执行内容:  ==RDD的生成, RDD算子的执行==**

- **Driver上执行内容:  ==spark context生成, 变量的定义, print执行==.**

- ##### Spark算子所接受的函数, 本质上是一个闭包, 因为其需要封闭作用域, 并且序列化自身和依赖, 分发到不同的节点中运行

> ##### 案例

```scala
class MyClass {
  val field = "Hello"

  def doStuff(rdd: RDD[String]): RDD[String] = {
    rdd.map(x => field + x)
  }
}
```

> 闭包就有了一个依赖, 依赖于外部的一个类, 因为传递给算子的函数最终要在 Executor 中运行, 所以需序列化 MyClass 发给每一个 Executor, 从而在 Executor 访问 MyClass 对象的属性.



### 累加器

> #### 实现全局中进行累加计数

**引出问题**

> ```scala
> val config = new SparkConf().setAppName("ip_ana").setMaster("local[6]")
> val sc = new SparkContext(config)
> var count = 0
> 
> sc.parallelize(Seq(1, 2, 3, 4, 5))
> .foreach(count += _)
> 
> println(count)   //结果为0
> ```
>
> **问题 :**   程序打印的结果不是15，而是0.

**问题分析**

- ##### count变量定义和println是在driver中执行的;  foreach函数是属于rdd对象, 是在executor中执行的;  所以当count变量被在rdd中使用时, 出现了变量的“跨域”问题，也就是闭包问题.

> 由于count函数和在rdd对象的foreach函数是属于不同“闭包”;  传进foreach中的count是一个副本，初始值都为0; 不管副本如何变化, 都不会影响到main函数中的count, 所以最终打印出来的count为0.

#### 全局累加器

> **==Accumulators(累加器) 是一个只支持added(添加) 的分布式变量==**, 可以在分布式环境下保持一致性, 并且能够做到高效的并发.

- ##### 概念

  - 原生Spark支持数值型的累加器, 只能==**实现求和，计数和平均值.**==

    - **LongAccumulator**用来累加整数型
    - **DoubleAccumulator**用来累加浮点型
    - **CollectionAccumulator**用来累加集合元素

  - ##### Accumulator 是支持并发并行的

  - ##### ==累加器只能在Driver端定义初始值和读取数据，在Excutor端中更新数据.==

- ##### 应用场景

  > ##### 用来在Spark Streaming应用中记录某些事件的数量

- 实现步骤
  1. **通过调用 SparkContext.longAccumulator( ) 方法, 创建出存有初始值的累加器。**
  2. **在闭包函数体里调用add()方法, 增加累加器的值。**
  3. **通过调用value方法来访问累加器的值。**

```scala
val config = new SparkConf().setAppName("ip_ana").setMaster("local[6]")
val sc = new SparkContext(config)

//创建出存有初始值的累加器
val counter = sc.longAccumulator("counter")

sc.parallelize(Seq(1, 2, 3, 4, 5))
  .foreach(counter.add(_))  // 增加累加器的值

// 访问累加器的值
println(counter.value)    
```

#### 自定义累加器

> 开发者可以通过自定义累加器来实现更多功能.

- 实现步骤
  1. **创建自定义累加器, 继承AccumulatorV2.**
  2. **重写多个方法**

> 需求:  把RDD的元素输出为set集合

```scala
class Accumulator {

  /**
   * RDD -> (1, 2, 3, 4, 5) -> Set(1,2,3,4,5)
   */
  @Test
  def acc(): Unit = {
    val config = new SparkConf().setAppName("acc").setMaster("local[6]")
    val sc = new SparkContext(config)

    val numAcc = new NumAccumulator()
    // 注册给 Spark
    sc.register(numAcc, "num")

    sc.parallelize(Seq("1", "2", "3"))
      .foreach(item => numAcc.add(item))

    println(numAcc.value)

    sc.stop()
  }
}


class NumAccumulator extends AccumulatorV2[String, Set[String]] {
  private val nums: mutable.Set[String] = mutable.Set()

  /**
   * 告诉 Spark 框架, 这个累加器对象是否是空的
   */
  override def isZero: Boolean = {
    nums.isEmpty
  }

  /**
   * 提供给 Spark 框架一个拷贝的累加器
   *
   * @return
   */
  override def copy(): AccumulatorV2[String, Set[String]] = {
    val newAccumulator = new NumAccumulator()
    nums.synchronized {
      newAccumulator.nums ++= this.nums
    }
    newAccumulator
  }

  /**
   * 帮助 Spark 框架, 清理累加器的内容
   */
  override def reset(): Unit = {
    nums.clear()
  }

  /**
   * 外部传入要累加的内容, 在这个方法中进行累加
   */
  override def add(v: String): Unit = {
    nums += v
  }

  /**
   * 累加器在进行累加的时候, 可能每个分布式节点都有一个实例
   * 在最后 Driver 进行一次合并, 把所有的实例的内容合并起来, 会调用这个 merge 方法进行合并
   */
  override def merge(other: AccumulatorV2[String, Set[String]]): Unit = {
    nums ++= other.value
  }

  /**
   * 提供给外部累加结果
   * 需要返回一个不可变的集合, 因为不能因为外部的修改而影响自身的值
   */
  override def value: Set[String] = {
    nums.toSet
  }
}
```



### 广播变量*

> #### 优化变量共享的性能

**BlockManager**

> **概念:**  负责管理某个Executor对应的内存和磁盘上的数据.

#### 广播变量的原理

> 广播变量，初始的时候，就在Drvier上有一份副本。task在运行的时候，想要使用广播变量中的数据，此时首先会在自己本地的Executor对应的BlockManager中，尝试获取变量副本；如果本地没有，那么就从Driver远程拉取变量副本，并保存在本地的BlockManager中；此后这个executor上的task，都会直接使用本地的BlockManager中的副本。executor的BlockManager除了从driver上拉取，也可能从其他节点的BlockManager上拉取变量副本。

#### 广播变量作用

- 广播变量的作用就是不需要每个task带上一份变量副本, 而是变成**==每个节点的executor才有一份副本.==**
- 广播变量**==只能在 Driver 端定义和修改==**，不能在 Executor 端定义和修改.

#### 广播变量适用场景

- 一个变量的数据量较大的时候
- 一个Executor中有多个Task的时候

#### 广播变量API

| 方法名        | 描述                                   |
| :------------ | :------------------------------------- |
| **id**        | 唯一标识                               |
| **value**     | 广播变量的值                           |
| **unpersist** | 在 Executor 中异步的删除缓存副本       |
| **destroy**   | 销毁所有此广播变量所关联的数据和元数据 |
| **toString**  | 字符串表示                             |

- ##### 实现步骤

  1. 通过对一个类型 T 的对象调用 SparkContext.**broadcast** 创建出一个Broadcast[T] 对象
  2. **通过 value 属性访问该对象的值**
  3. 变量只会被发到各个节点一次，应作为只读值处理(修改这个值不会影响到别的节点).

```scala
def test(): Unit = {
  val config = new SparkConf().setMaster("local[6]").setAppName("test")
  val sc = new SparkContext(config)
    
  // 数据, 假装这个数据很大, 大概一百兆
  val v: Map[String, String] = Map("Spark" -> "http://spark.apache.cn", "Scala" -> "http://www.scala-lang.org")
    
  // 创建广播
  val b: broadcast.Broadcast[Map[String, String]] = sc.broadcast(v)
  
  // 将其中的 Spark 和 Scala 转为对应的网址
  val r: RDD[String] = sc.parallelize(Seq("Spark", "Scala"))
    
  // 在算子中使用广播变量代替直接引用集合, 只会复制和executor一样的数量
  // 在使用广播之前, 复制 map 了 task 数量份
  // 在使用广播以后, 复制次数和 executor 数量一致
  val result: Array[String] = r.map(item => b.value(item)).collect()
  result.foreach(println(_))
}
```







<script>
export default {
    mounted () {
      this.$page.lastUpdated = "2022-01-01 22:22:22";
    }
  }
</script>


 














